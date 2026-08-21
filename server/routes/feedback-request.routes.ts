import {
  changeFeedbackRequestStatus,
  createFeedbackRequest,
  editFeedbackRequest,
  getFeedbackRequest,
  getFeedbackRequests,
  getMyFeedbackRequests,
  pinFeedbackRequest,
  removeFeedbackRequest,
} from "../controllers/feedback-request.controller";
import {
  validate,
  validateParams,
  validateQuery,
} from "../middleware/validation.middleware";
import verifyToken, { verifyAdmin } from "../middleware/verifyToken.middleware";
import {
  changeFeedbackRequestStatusSchema,
  createFeedbackRequestSchema,
  editFeedbackRequestSchema,
  listFeedbackRequestsQuerySchema,
  pinFeedbackRequestSchema,
  feedbackRequestIdParamsSchema,
} from "../validations/feedback-request.schemas";
import { Router } from "express";

const feedbackRequestRoutes = Router();

feedbackRequestRoutes
  .route("/")
  .get(validateQuery(listFeedbackRequestsQuerySchema), getFeedbackRequests)
  .post(validate(createFeedbackRequestSchema), createFeedbackRequest);

feedbackRequestRoutes
  .route("/mine")
  .get(validateQuery(listFeedbackRequestsQuerySchema), getMyFeedbackRequests);

feedbackRequestRoutes
  .route("/:id/status")
  .patch(
    verifyAdmin,
    validateParams(feedbackRequestIdParamsSchema),
    validate(changeFeedbackRequestStatusSchema),
    changeFeedbackRequestStatus,
  );

feedbackRequestRoutes
  .route("/:id/pin")
  .patch(
    verifyAdmin,
    validateParams(feedbackRequestIdParamsSchema),
    validate(pinFeedbackRequestSchema),
    pinFeedbackRequest,
  );

feedbackRequestRoutes
  .route("/:id")
  .get(validateParams(feedbackRequestIdParamsSchema), getFeedbackRequest)
  .patch(
    validateParams(feedbackRequestIdParamsSchema),
    validate(editFeedbackRequestSchema),
    editFeedbackRequest,
  )
  .delete(validateParams(feedbackRequestIdParamsSchema), removeFeedbackRequest);

export default feedbackRequestRoutes;
