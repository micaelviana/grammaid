import Joi from "joi"
import { ErrorType } from "./error.constants"

const createErrorSchema = Joi.object().keys({
  errorType: Joi.string()
    .valid(...Object.values(ErrorType))
    .required(),
  description: Joi.string().required(),
  suggestion: Joi.string().required(),
  startingPos: Joi.number().integer().min(0).required(),
  endingPos: Joi.number().integer().min(0).required(),
  criteriaId: Joi.string().uuid().required(),
  reviewId: Joi.string().uuid().required(),
})

const updateErrorSchema = Joi.object().keys({
  errorType: Joi.string().valid(...Object.values(ErrorType)),
  description: Joi.string(),
  suggestion: Joi.string(),
  startingPos: Joi.number().integer().min(0),
  endingPos: Joi.number().integer().min(0),
})

export { createErrorSchema, updateErrorSchema }
