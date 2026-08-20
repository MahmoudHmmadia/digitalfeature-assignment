import { Router } from "express";
import { getCategories } from "../controllers/category.controller";
import { validateQuery } from "../middleware/validation.middleware";
import { categoryListQuerySchema } from "../validations/category.schemas";

const categoryRoutes = Router();

categoryRoutes.get("/", validateQuery(categoryListQuerySchema), getCategories);

export default categoryRoutes;
