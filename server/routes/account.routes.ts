import { Router } from "express";
import { validate, validateParams, validateQuery } from "../middleware/validation.middleware";
import {
  editMyAccountSchema,
  toggleAccountSuspendedSchema,
  setAccountDeletedSchema,
  accountIdParamsSchema,
  listAccountsQuerySchema,
} from "@/validations/account.schemas";
import {
  editMyAccount,
  getAccounts,
  toggleAccountSuspended,
  removeMyAccount,
  setAccountDeleted,
} from "@/controllers/account.controller";
import { verifyAdmin } from "@/middleware/verifyToken.middleware";
import { createMulter } from "@/utils/lib";

const accountRoutes = Router();
const multer = createMulter({ dir: "accounts" });
accountRoutes
  .route("/")
  .get(verifyAdmin, validateQuery(listAccountsQuerySchema), getAccounts)
  .patch(multer.single("avatar"), validate(editMyAccountSchema), editMyAccount)
  .delete(removeMyAccount);

accountRoutes
  .route("/toggle-suspended")
  .post(
    verifyAdmin,
    validate(toggleAccountSuspendedSchema),
    toggleAccountSuspended,
  );

accountRoutes
  .route("/:id/deleted")
  .patch(verifyAdmin, validateParams(accountIdParamsSchema), validate(setAccountDeletedSchema), setAccountDeleted);

export default accountRoutes;
