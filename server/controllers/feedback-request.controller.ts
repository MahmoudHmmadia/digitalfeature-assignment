import { Request, Response } from "express";
import { ADMIN_ROLE, PUBLIC_ACCOUNT_SHAPE } from "@/constants/shapes";
import { paginate } from "@/utils/lib";
import { prisma } from "@/utils/prisma";
import {
  ChangeFeedbackRequestStatusDto,
  CreateFeedbackRequestDto,
  EditFeedbackRequestDto,
  ListFeedbackRequestsQueryDto,
  PinFeedbackRequestDto,
  FeedbackRequestIdParamsDto,
} from "@/validations/feedback-request.schemas";
import {
  clientErrorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses";

function requestId(req: Request) {
  return (req.params as FeedbackRequestIdParamsDto).id;
}

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;

const feedbackRequestInclude = (accountId: string) => ({
  author: { select: PUBLIC_ACCOUNT_SHAPE },
  category: true,
  votes: {
    where: { authorId: accountId },
    select: { id: true },
  },
  _count: {
    select: {
      votes: true,
      comments: true,
    },
  },
});

type FeedbackRequestRecord = {
  _count?: {
    votes?: number;
    comments?: number;
  };
  votes?: Array<{ id: string }>;
  [key: string]: unknown;
};

function serializeFeedbackRequest(item: FeedbackRequestRecord) {
  const { _count, votes, ...rest } = item;

  return {
    ...rest,
    voteCount: _count?.votes ?? 0,
    commentCount: _count?.comments ?? 0,
    hasVoted: Array.isArray(votes) ? votes.length > 0 : false,
  };
}

function buildListQuery(
  filters: ListFeedbackRequestsQueryDto,
  authorIdOverride?: string,
) {
  const query: Record<string, unknown> = {};

  if (filters.search) {
    query.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.categoryId) query.categoryId = filters.categoryId;
  if (filters.status) query.status = filters.status;
  if (filters.pinned !== undefined) query.pinned = filters.pinned;

  const authorId = authorIdOverride || filters.authorId;
  if (authorId) query.authorId = authorId;

  return query;
}

function buildListOrderBy(filters: ListFeedbackRequestsQueryDto) {
  const sortOrder = filters.sortOrder || "desc";
  const sortBy = filters.sortBy || "createdAt";

  const secondary =
    sortBy === "votes"
      ? { votes: { _count: sortOrder } }
      : { [sortBy]: sortOrder };

  return [{ pinned: "desc" as const }, secondary];
}

async function findActiveCategory(categoryId: string) {
  return prisma.category.findFirst({
    where: { id: categoryId, isActive: true },
  });
}

async function assertWithinSubmissionRateLimit(authorId: string) {
  const limit = 10;
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);

  const submittedCount = await prisma.feedbackRequest.count({
    where: {
      authorId,
      createdAt: { gte: since },
    },
  });

  return submittedCount < limit;
}

export async function createFeedbackRequest(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    const body = req.body as CreateFeedbackRequestDto;

    const allowed = await assertWithinSubmissionRateLimit(req.account.id);
    if (!allowed) {
      return clientErrorResponse({
        res,
        req,
        message: "RATE_LIMIT_EXCEEDED",
      });
    }

    const category = await findActiveCategory(body.categoryId);
    if (!category) {
      return clientErrorResponse({ res, req, message: "INVALID_DATA" });
    }

    const created = await prisma.feedbackRequest.create({
      data: {
        title: body.title,
        description: body.description,
        categoryId: body.categoryId,
        authorId: req.account.id,
      },
      include: feedbackRequestInclude(req.account.id),
    });

    return successResponse({
      res,
      req,
      status: 201,
      message: "CREATED_SUCCESSFULLY",
      data: serializeFeedbackRequest(created),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function editFeedbackRequest(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    const existing = await prisma.feedbackRequest.findUnique({
      where: { id: requestId(req) },
    });

    if (!existing) {
      return clientErrorResponse({
        res,
        req,
        message: "NOT_FOUND",
        status: 404,
      });
    }

    const isOwner = existing.authorId === req.account.id;
    const isAdmin = req.account.role === ADMIN_ROLE;

    if (!isOwner && !isAdmin) {
      return clientErrorResponse({
        res,
        req,
        message: "NO_PERMISSIONS",
        status: 403,
      });
    }

    const body = req.body as EditFeedbackRequestDto;

    if (body.categoryId) {
      const category = await findActiveCategory(body.categoryId);
      if (!category) {
        return clientErrorResponse({ res, req, message: "INVALID_DATA" });
      }
    }

    const updated = await prisma.feedbackRequest.update({
      where: { id: existing.id },
      data: {
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.description !== undefined
          ? { description: body.description }
          : {}),
        ...(body.categoryId ? { categoryId: body.categoryId } : {}),
      },
      include: feedbackRequestInclude(req.account.id),
    });

    return successResponse({
      res,
      req,
      message: "UPDATED_SUCCESSFULLY",
      data: serializeFeedbackRequest(updated),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

async function listFeedbackRequestsFor(
  req: Request,
  res: Response,
  authorIdOverride?: string,
  excludeAuthorId?: string,
) {
  const filters = req.query as ListFeedbackRequestsQueryDto;
  const accountId = req.account!.id;

  const { data, pagesNumber, totalCount } = await paginate({
    req,
    prismaModel: prisma.feedbackRequest,
    query: {
      ...buildListQuery(filters, authorIdOverride),
      ...(excludeAuthorId ? { authorId: { not: excludeAuthorId } } : {}),
    },
    populate: feedbackRequestInclude(accountId),
    orderBy: buildListOrderBy(filters),
  });

  return successResponse({
    res,
    req,
    data: {
      data: data.map((item: FeedbackRequestRecord) =>
        serializeFeedbackRequest(item),
      ),
      pagesNumber,
      totalCount,
    },
  });
}

export async function getFeedbackRequests(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    return await listFeedbackRequestsFor(req, res, undefined, req.account.id);
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getMyFeedbackRequests(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    return await listFeedbackRequestsFor(req, res, req.account.id);
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function getFeedbackRequest(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    const data = await prisma.feedbackRequest.findUnique({
      where: { id: requestId(req) },
      include: feedbackRequestInclude(req.account.id),
    });

    if (!data) {
      return clientErrorResponse({
        res,
        req,
        message: "NOT_FOUND",
        status: 404,
      });
    }

    return successResponse({
      res,
      req,
      data: serializeFeedbackRequest(data),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function removeFeedbackRequest(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    const existing = await prisma.feedbackRequest.findUnique({
      where: { id: requestId(req) },
    });

    if (!existing) {
      return clientErrorResponse({
        res,
        req,
        message: "NOT_FOUND",
        status: 404,
      });
    }

    const isOwner = existing.authorId === req.account.id;
    const isAdmin = req.account.role === ADMIN_ROLE;

    if (!isOwner && !isAdmin) {
      return clientErrorResponse({
        res,
        req,
        message: "NO_PERMISSIONS",
        status: 403,
      });
    }

    await prisma.feedbackRequest.delete({
      where: { id: existing.id },
    });

    return successResponse({
      res,
      req,
      message: "DELETED_SUCCESSFULLY",
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function changeFeedbackRequestStatus(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    const existing = await prisma.feedbackRequest.findUnique({
      where: { id: requestId(req) },
    });

    if (!existing) {
      return clientErrorResponse({
        res,
        req,
        message: "NOT_FOUND",
        status: 404,
      });
    }

    const { status } = req.body as ChangeFeedbackRequestStatusDto;

    const updated = await prisma.feedbackRequest.update({
      where: { id: existing.id },
      data: { status },
      include: feedbackRequestInclude(req.account.id),
    });

    return successResponse({
      res,
      req,
      message: "UPDATED_SUCCESSFULLY",
      data: serializeFeedbackRequest(updated),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}

export async function pinFeedbackRequest(req: Request, res: Response) {
  try {
    if (!req.account) {
      return clientErrorResponse({
        res,
        req,
        message: "UNAUTHORIZED",
        status: 401,
      });
    }

    const existing = await prisma.feedbackRequest.findUnique({
      where: { id: requestId(req) },
    });

    if (!existing) {
      return clientErrorResponse({
        res,
        req,
        message: "NOT_FOUND",
        status: 404,
      });
    }

    const { pinned } = req.body as PinFeedbackRequestDto;

    const updated = await prisma.feedbackRequest.update({
      where: { id: existing.id },
      data: { pinned },
      include: feedbackRequestInclude(req.account.id),
    });

    return successResponse({
      res,
      req,
      message: "UPDATED_SUCCESSFULLY",
      data: serializeFeedbackRequest(updated),
    });
  } catch (err) {
    return serverErrorResponse({ err, res, req });
  }
}
