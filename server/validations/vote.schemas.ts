import Joi from "joi";

export type ToggleVoteDto = {
  feedbackRequestId: string;
};
export type ListVotesQueryDto = { feedbackRequestId?: string; mine?: boolean; page?: number; limit?: number; startIndex?: number };

export const toggleVoteSchema = Joi.object({
  feedbackRequestId: Joi.string().hex().length(24).required(),
});

export const listVotesQuerySchema = Joi.object({
  feedbackRequestId: Joi.string().hex().length(24).optional(),
  mine: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  startIndex: Joi.number().integer().min(0).optional(),
});
