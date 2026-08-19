import { Request, Response } from "express";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";

import { prisma } from "@/utils/prisma";
import { deleteFile, imagesUrl, paginate } from "@/utils/lib";
import {
  EditMyAccountDto,
  ToggleAccountSuspendedDto,
} from "@/validations/account.schemas";
import { PUBLIC_ACCOUNT_SHAPE } from "@/constants/shapes";

export async function editMyAccount(req: Request, res: Response) {
  try {
    const { name } = req.body as EditMyAccountDto;

    const account = await prisma.account.findUnique({
      where: {
        id: req.account!.id,
      },
    });

    if (!account)
      return clientErrorResponse({
        req,
        res,
        message: "NO_PERMISSIONS",
      });

    await prisma.account.update({
      where: {
        id: req.account!.id,
      },
      data: {
        name,
        avatarUrl: req.file
          ? `${imagesUrl()}/accounts/${req.file.filename}`
          : account.avatarUrl,
      },
    });

    if (req.file && account.avatarUrl)
      deleteFile({
        dirName: "accounts",
        url: account.avatarUrl,
      });

    return successResponse({
      res,
      req,
      message: "MY_ACCOUNT_UPDATED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function toggleAccountSuspended(req: Request, res: Response) {
  try {
    const { id } = req.body as ToggleAccountSuspendedDto;

    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    });

    if (!account)
      return clientErrorResponse({
        req,
        res,
        message: "NOT_FOUND",
      });

    await prisma.account.update({
      where: {
        id,
      },
      data: {
        isSuspended: !account.isSuspended,
      },
    });

    return successResponse({
      res,
      req,
      message: account.isSuspended
        ? "ACCOUNT_UN_SUSPENDED_SUCCESSFULLY"
        : "ACCOUNT_SUSPENDED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getAccounts(req: Request, res: Response) {
  try {
    const { name, email, isSuspended } = req.query as {
      name?: any;
      email?: string;
      isSuspended?: string;
    };
    const where: { name?: any; email?: any; isSuspended?: boolean } = {};

    if (name) where.name = { contains: name, mode: "insensitive" };
    if (email) where.email = { contains: email, mode: "insensitive" };
    if (isSuspended) where.isSuspended = isSuspended === "true";

    const { data, totalCount, pagesNumber } = await paginate({
      query: where,
      prismaModel: prisma.account,
      req,
      select: PUBLIC_ACCOUNT_SHAPE,
    });

    return successResponse({
      res,
      req,
      data: {
        data,
        totalCount,
        pagesNumber,
      },
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
