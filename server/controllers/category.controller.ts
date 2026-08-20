import type { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { serverErrorResponse, successResponse } from "../utils/responses";
import { paginate } from "../utils/lib";
import type { CategoryListQueryDto } from "../validations/category.schemas";

export async function getCategories(req: Request, res: Response) {
  try {
    const { search } = req.query as CategoryListQueryDto;
    const { data, totalCount, pagesNumber } = await paginate({
      req,
      prismaModel: prisma.category,
      query: {
        isActive: true,
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: { name: "asc" },
    });
    return successResponse({
      req,
      res,
      data: { data, totalCount, pagesNumber },
    });
  } catch (err) {
    return serverErrorResponse({ req, res, err });
  }
}
