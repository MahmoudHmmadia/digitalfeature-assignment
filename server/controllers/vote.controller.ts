import { Request, Response } from "express";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";

import { prisma } from "@/utils/prisma";
import { paginate } from "@/utils/lib";
import { VOTE_SHAPE } from "@/constants/shapes";
import { ListVotesQueryDto, ToggleVoteDto } from "@/validations/vote.schemas";

export async function toggleVote(req: Request, res: Response) {
  try {
    const { feedbackRequestId } = req.body as ToggleVoteDto;

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

    const isExist = await prisma.vote.findFirst({
      where: {
        feedbackRequestId,
        authorId: req.account!.id,
      },
    });

    if (!isExist) {
      await prisma.vote.create({
        data: {
          feedbackRequestId,
          authorId: req.account!.id,
        },
      });
    } else {
      await prisma.vote.delete({
        where: {
          id: isExist.id,
        },
      });
    }

    return successResponse({
      res,
      req,
      message: !isExist ? "VOTED_SUCCESSFULLY" : "UN_VOTED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getVotes(req: Request, res: Response) {
  try {
    const { feedbackRequestId, mine } = req.query as ListVotesQueryDto;

    const where: { feedbackRequestId?: string; authorId?: string } = {};

    if (feedbackRequestId)
      where.feedbackRequestId = feedbackRequestId;
    if (mine) where.authorId = req.account!.id;

    const { data, totalCount, pagesNumber } = await paginate({
      query: where,
      prismaModel: prisma.vote,
      req,
      select: VOTE_SHAPE,
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
