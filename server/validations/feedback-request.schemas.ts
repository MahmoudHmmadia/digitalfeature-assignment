import Joi from "joi";
import type {
  CreateFeedbackRequestContract,
  EditFeedbackRequestContract,
  ListFeedbackRequestsContract,
} from "@feedbackhub/shared";

const objectId = Joi.string().hex().length(24);

export type CreateFeedbackRequestDto = CreateFeedbackRequestContract;

export type EditFeedbackRequestDto = EditFeedbackRequestContract;

export type ChangeFeedbackRequestStatusDto = { status: number };

export type PinFeedbackRequestDto = {
  pinned: boolean;
};

export type ListFeedbackRequestsQueryDto = ListFeedbackRequestsContract;
export type FeedbackRequestIdParamsDto = { id: string };

export const createFeedbackRequestSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).required(),
  description: Joi.string().trim().min(1).max(5000).required(),
  categoryId: objectId.required(),
});

export const editFeedbackRequestSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).optional(),
  description: Joi.string().trim().min(1).max(5000).optional(),
  categoryId: objectId.optional(),
}).min(1);

export const changeFeedbackRequestStatusSchema = Joi.object({
  status: Joi.number().integer().min(0).max(5).required(),
});

export const pinFeedbackRequestSchema = Joi.object({
  pinned: Joi.boolean().required(),
});

export const listFeedbackRequestsQuerySchema = Joi.object({
  search: Joi.string().trim().allow("").optional(),
  categoryId: objectId.optional(),
  status: Joi.number().integer().min(0).max(5).optional(),
  authorId: objectId.optional(),
  pinned: Joi.boolean().optional(),
  sortBy: Joi.string()
    .valid("createdAt", "updatedAt", "title", "votes")
    .optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  startIndex: Joi.number().integer().min(0).optional(),
});
export const feedbackRequestIdParamsSchema = Joi.object({
  id: objectId.required(),
});
