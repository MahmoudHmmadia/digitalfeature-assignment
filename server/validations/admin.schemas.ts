import Joi from "joi";
import { categoryListQuerySchema } from "./category.schemas";

export const adminCategoryListQuerySchema = categoryListQuerySchema.keys({
  active: Joi.boolean().optional(),
  sortBy: Joi.string().valid("name", "createdAt", "updatedAt").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
});

export const categoryCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  description: Joi.string().trim().max(240).allow("").optional(),
});

export const categoryUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).optional(),
  description: Joi.string().trim().max(240).allow("").optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

export const appSettingsUpdateSchema = Joi.object({
  appVersion: Joi.string().trim().min(1).max(30).required(),
  maintenanceMode: Joi.boolean().required(),
});
