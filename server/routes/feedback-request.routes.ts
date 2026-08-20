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
import { validate, validateQuery } from "../middleware/validation.middleware";
import verifyToken, { verifyAdmin } from "../middleware/verifyToken.middleware";
import {
  changeFeedbackRequestStatusSchema,
  createFeedbackRequestSchema,
  editFeedbackRequestSchema,
  listFeedbackRequestsQuerySchema,
  pinFeedbackRequestSchema,
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
    validate(changeFeedbackRequestStatusSchema),
    changeFeedbackRequestStatus,
  );

feedbackRequestRoutes
  .route("/:id/pin")
  .patch(verifyAdmin, validate(pinFeedbackRequestSchema), pinFeedbackRequest);

feedbackRequestRoutes
  .route("/:id")
  .get(getFeedbackRequest)
  .patch(validate(editFeedbackRequestSchema), editFeedbackRequest)
  .delete(removeFeedbackRequest);

export default feedbackRequestRoutes;
