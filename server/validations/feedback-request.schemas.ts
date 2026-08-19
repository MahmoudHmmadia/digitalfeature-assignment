import Joi from 'joi'

export type CreateFeedbackRequestDto = {
  title: string
  description: string
}

export type EditFeedbackRequestDto = {
  title?: string
  description?: string
}

export const createFeedbackRequestSchema = Joi.object({})

export const editFeedbackRequestSchema = Joi.object({})
