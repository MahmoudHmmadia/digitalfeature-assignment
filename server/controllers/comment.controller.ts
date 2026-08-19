import { Request, Response } from "express";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";
import {
  CreateCommentDto,
  EditCommentDto,
} from "@/validations/comment.schemas";
import { prisma } from "@/utils/prisma";
import { paginate } from "@/utils/lib";
import { COMMENT_SHAPE } from "@/constants/shapes";

export async function createComment(req: Request, res: Response) {
  try {
    const { content, feedbackRequestId } = req.body as CreateCommentDto;

    const feedbackRequest = await prisma.feedbackRequest.findUnique({
      where: {
        id: feedbackRequestId,
      },
    });

    if (!feedbackRequest)
      return clientErrorResponse({
        req,
        res,
        message: "NOT_FOUND",
      });

    await prisma.comment.create({
      data: {
        content,
        feedbackRequestId,
        authorId: req.account!.id,
      },
    });

    return successResponse({
      res,
      req,
      message: "COMMENT_CREATED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function editComment(req: Request, res: Response) {
  try {
    const { content, id } = req.body as EditCommentDto;

    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment)
      return clientErrorResponse({
        req,
        res,
        message: "NOT_FOUND",
      });

    if (comment.authorId != req.account!.id)
      return clientErrorResponse({
        req,
        res,
        message: "NO_PERMISSIONS",
      });

    await prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });

    return successResponse({
      res,
      req,
      message: "COMMENT_UPDATED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const { feedbackRequestId } = req.query;

    const where: { feedbackRequestId?: string } = {};

    if (feedbackRequestId)
      where.feedbackRequestId = feedbackRequestId as string;

    const { data, totalCount, pagesNumber } = await paginate({
      query: where,
      prismaModel: prisma.comment,
      req,
      select: COMMENT_SHAPE,
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

export async function removeComment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!comment)
      return clientErrorResponse({
        req,
        res,
        message: "NOT_FOUND",
      });

    if (comment.authorId != req.account!.id)
      return clientErrorResponse({
        req,
        res,
        message: "NO_PERMISSIONS",
      });

    await prisma.comment.delete({
      where: {
        id: id as string,
      },
    });

    return successResponse({
      res,
      req,
      message: "COMMENT_DELETED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
