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
import { createMulter } from "@/utils/lib";

const accountRoutes = Router();
const multer = createMulter({ dir: "accounts" });
accountRoutes
  .route("/")
  .get(verifyAdmin, getAccounts)
  .patch(multer.single("avatar"), validate(editMyAccountSchema), editMyAccount);

accountRoutes
  .route("/toggle-suspended")
  .post(
    verifyAdmin,
    validate(toggleAccountSuspendedSchema),
    toggleAccountSuspended,
  );

export default accountRoutes;
