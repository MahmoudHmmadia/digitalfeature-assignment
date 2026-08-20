import Joi from "joi";
import { categoryListQuerySchema } from "./category.schemas";
export type AdminCategoryListQueryDto = {
  search?: string;
  active?: boolean;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  startIndex?: number;
};
export type CreateCategoryDto = { name: string; description?: string };
export type UpdateCategoryDto = {
  name?: string;
  description?: string;
  isActive?: boolean;
};
export type AppSettingsUpdateDto = {
  appVersion: string;
  maintenanceMode: boolean;
};
export type CategoryIdParamsDto = { id: string };

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
export const categoryIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
