import Joi from "joi";

export type CreateCommentDto = {
  content: string;
  feedbackRequestId: string;
};

export type EditCommentDto = {
  id: string;
  content: string;
};

export const createCommentSchema = Joi.object({
  content: Joi.string().required(),
  feedbackRequestId: Joi.string().required(),
});

export const editCommentSchema = Joi.object({
  id: Joi.string().required(),
  content: Joi.string().required(),
});

export const listCommentsQuerySchema = Joi.object({
  feedbackRequestId: Joi.string().hex().length(24).optional(),
  mine: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  startIndex: Joi.number().integer().min(0).optional(),
});
