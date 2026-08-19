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
