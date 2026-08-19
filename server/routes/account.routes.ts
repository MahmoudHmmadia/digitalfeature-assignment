import { Router } from "express";
import { validate } from "../middleware/validation.middleware";
import {
  editMyAccountSchema,
  toggleAccountSuspendedSchema,
} from "@/validations/account.schemas";
import {
  editMyAccount,
  getAccounts,
  toggleAccountSuspended,
} from "@/controllers/account.controller";
import { verifyAdmin } from "@/middleware/verifyToken.middleware";

const accountRoutes = Router();

accountRoutes
  .route("/")
  .get(verifyAdmin, getAccounts)
  .patch(validate(editMyAccountSchema), editMyAccount);

accountRoutes
  .route("/toggle-suspended")
  .post(
    verifyAdmin,
    validate(toggleAccountSuspendedSchema),
    toggleAccountSuspended,
  );

export default accountRoutes;
