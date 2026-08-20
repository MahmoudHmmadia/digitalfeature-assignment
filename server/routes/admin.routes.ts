import { Router } from "express";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminAnalytics,
  getAdminCategories,
  getAppSettings,
  updateAdminCategory,
  updateAppSettings,
} from "@/controllers/admin.controller";
import { validate, validateParams, validateQuery } from "@/middleware/validation.middleware";
import {
  adminCategoryListQuerySchema,
  appSettingsUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  categoryIdParamsSchema,
} from "@/validations/admin.schemas";

const adminRoutes = Router();

adminRoutes.get("/analytics", getAdminAnalytics);

adminRoutes.get(
  "/categories",

  validateQuery(adminCategoryListQuerySchema),
  getAdminCategories,
);
adminRoutes.post(
  "/categories",

  validate(categoryCreateSchema),
  createAdminCategory,
);
adminRoutes.patch(
  "/categories/:id",
  validateParams(categoryIdParamsSchema),
  validate(categoryUpdateSchema),
  updateAdminCategory,
);
adminRoutes.delete("/categories/:id", validateParams(categoryIdParamsSchema), deleteAdminCategory);
adminRoutes.get("/settings", getAppSettings);
adminRoutes.patch(
  "/settings",
  validate(appSettingsUpdateSchema),
  updateAppSettings,
);

export default adminRoutes;
