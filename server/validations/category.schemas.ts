import Joi from "joi";
import type { CategoryListContract } from "@feedbackhub/shared";
export type CategoryListQuery = CategoryListContract;
export const categoryListQuerySchema = Joi.object({
  search: Joi.string().trim().allow("").optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  startIndex: Joi.number().integer().min(0).optional(),
});
