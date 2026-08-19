import { request, Router } from 'express'
import {
  createFeedbackRequest,
  removeFeedbackRequest,
  editFeedbackRequest,
  getFeedbackRequest,
  getFeedbackRequests,
} from '../controllers/feedback-request.controller'
import { validate } from '../middleware/validation.middleware'
import {
  createFeedbackRequestSchema,
  editFeedbackRequestSchema,
} from '../validations/feedback-request.schemas'

const feedbackRequestRoutes = Router()

feedbackRequestRoutes
  .route('/')
  .get(getFeedbackRequests)
  .post(validate(createFeedbackRequestSchema), createFeedbackRequest)
  .patch(validate(editFeedbackRequestSchema), editFeedbackRequest)

feedbackRequestRoutes
  .route('/:id')
  .delete(removeFeedbackRequest)
  .get(getFeedbackRequest)

export default feedbackRequestRoutes
