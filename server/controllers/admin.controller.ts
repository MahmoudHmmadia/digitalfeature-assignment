import { Request, Response } from "express";
import { prisma } from "@/utils/prisma";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "@/utils/responses";
import { paginate } from "@/utils/lib";
import type {
  AdminCategoryListQueryDto,
  AppSettingsUpdateDto,
  CategoryIdParamsDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/validations/admin.schemas";

export async function getAdminAnalytics(req: Request, res: Response) {
  try {
    const [
      users,
      activeUsers,
      suspendedUsers,
      deletedUsers,
      feedback,
      comments,
      votes,
      categories,
      statuses,
    ] = await Promise.all([
      prisma.account.count({ where: { role: 1 } }),
      prisma.account.count({
        where: { role: 1, isDeleted: false, isSuspended: false },
      }),
      prisma.account.count({
        where: { role: 1, isDeleted: false, isSuspended: true },
      }),
      prisma.account.count({ where: { role: 1, isDeleted: true } }),
      prisma.feedbackRequest.count(),
      prisma.comment.count(),
      prisma.vote.count(),
      prisma.category.count({ where: { isActive: true } }),
      prisma.feedbackRequest.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    return successResponse({
      req,
      res,
      data: {
        users: {
          total: users,
          active: activeUsers,
          suspended: suspendedUsers,
          deleted: deletedUsers,
        },
        feedback,
        comments,
        votes,
        categories,
        feedbackByStatus: statuses.map((item) => ({
          status: item.status,
          count: item._count._all,
        })),
      },
    });
  } catch (err) {
    return serverErrorResponse({ err, req, res });
  }
}

export async function getAdminCategories(req: Request, res: Response) {
  try {
    const {
      search,
      active,
      sortBy = "name",
      sortOrder = "asc",
    } = req.query as AdminCategoryListQueryDto;
    const result = await paginate({
      req,
      prismaModel: prisma.category,
      query: {
        ...(typeof active === "boolean" ? { isActive: active } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: { [sortBy]: sortOrder },
    });
    return successResponse({ req, res, data: result });
  } catch (err) {
    return serverErrorResponse({ req, res, err });
  }
}

export async function createAdminCategory(req: Request, res: Response) {
  try {
    const body = req.body as CreateCategoryDto;
    const category = await prisma.category.create({
      data: { ...body, description: body.description || null },
    });
    return successResponse({
      req,
      res,
      data: category,
      status: 201,
      message: "CREATED_SUCCESSFULLY",
    });
  } catch (err: any) {
    if (err?.code === "P2002")
      return clientErrorResponse({
        req,
        res,
        message: "ALREADY_EXISTS",
        status: 409,
      });
    return serverErrorResponse({ req, res, err });
  }
}

export async function updateAdminCategory(req: Request, res: Response) {
  try {
    const body = req.body as UpdateCategoryDto;
    const { id } = req.params as CategoryIdParamsDto;
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...body,
        ...(body.description !== undefined
          ? { description: body.description || null }
          : {}),
      },
    });
    return successResponse({
      req,
      res,
      data: category,
      message: "UPDATED_SUCCESSFULLY",
    });
  } catch (err: any) {
    if (err?.code === "P2002")
      return clientErrorResponse({
        req,
        res,
        message: "ALREADY_EXISTS",
        status: 409,
      });
    if (err?.code === "P2025")
      return clientErrorResponse({
        req,
        res,
        message: "NOT_FOUND",
        status: 404,
      });
    return serverErrorResponse({ req, res, err });
  }
}

export async function deleteAdminCategory(req: Request, res: Response) {
  try {
    const { id } = req.params as CategoryIdParamsDto;
    const relatedFeedback = await prisma.feedbackRequest.count({
      where: { categoryId: id },
    });
    if (relatedFeedback > 0)
      return clientErrorResponse({
        req,
        res,
        message: "CATEGORY_IN_USE",
        status: 409,
        data: { feedbackCount: relatedFeedback },
      });
    const category = await prisma.category.delete({
      where: { id },
    });
    return successResponse({
      req,
      res,
      data: category,
      message: "DELETED_SUCCESSFULLY",
    });
  } catch (err: any) {
    if (err?.code === "P2025")
      return clientErrorResponse({
        req,
        res,
        message: "NOT_FOUND",
        status: 404,
      });
    return serverErrorResponse({ req, res, err });
  }
}

export async function getAppSettings(req: Request, res: Response) {
  try {
    const settings =
      (await prisma.appSettings.findFirst()) ??
      (await prisma.appSettings.create({ data: {} }));
    return successResponse({ req, res, data: settings });
  } catch (err) {
    return serverErrorResponse({ req, res, err });
  }
}

export async function updateAppSettings(req: Request, res: Response) {
  try {
    const body = req.body as AppSettingsUpdateDto;
    const existing = await prisma.appSettings.findFirst();
    const enablingMaintenance =
      body.maintenanceMode === true && existing?.maintenanceMode !== true;
    const settings = existing
      ? await prisma.appSettings.update({
          where: { id: existing.id },
          data: body,
        })
      : await prisma.appSettings.create({ data: body });
    if (enablingMaintenance)
      await prisma.account.updateMany({
        where: { role: 1 },
        data: { token: null, fcmToken: null },
      });
    return successResponse({
      req,
      res,
      data: settings,
      message: "UPDATED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ req, res, err });
  }
}
