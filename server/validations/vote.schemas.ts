import Joi from "joi";

export type ToggleVoteDto = {
  feedbackRequestId: string;
};

export const toggleVoteSchema = Joi.object({
  feedbackRequestId: Joi.string().required(),
});
