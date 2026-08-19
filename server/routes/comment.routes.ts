import { Router } from "express";
import {
  createComment,
  removeComment,
  editComment,
  getComments,
} from "../controllers/comment.controller";
import { validate } from "../middleware/validation.middleware";
import {
  createCommentSchema,
  editCommentSchema,
} from "../validations/comment.schemas";

const commentRoutes = Router();

commentRoutes
  .route("/")
  .get(getComments)
  .post(validate(createCommentSchema), createComment)
  .patch(validate(editCommentSchema), editComment);

commentRoutes.route("/:id").delete(removeComment);

export default commentRoutes;
