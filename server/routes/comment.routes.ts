import { Router } from "express";
import {
  createComment,
  removeComment,
  editComment,
  getComments,
} from "../controllers/comment.controller";
import { validate, validateParams, validateQuery } from "../middleware/validation.middleware";
import {
  createCommentSchema,
  editCommentSchema,
  listCommentsQuerySchema,
  commentIdParamsSchema,
} from "../validations/comment.schemas";

const commentRoutes = Router();

commentRoutes
  .route("/")
  .get(validateQuery(listCommentsQuerySchema), getComments)
  .post(validate(createCommentSchema), createComment)
  .patch(validate(editCommentSchema), editComment);

commentRoutes.route("/:id").delete(validateParams(commentIdParamsSchema), removeComment);

export default commentRoutes;
