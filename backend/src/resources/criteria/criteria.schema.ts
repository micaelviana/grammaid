import Joi from "joi"
import { CriteriaType } from "./criteria.constants"

const createCriteriaSchema = Joi.object().keys({
  criteriaType: Joi.string()
    .valid(...Object.values(CriteriaType))
    .required(),
  score: Joi.number().min(0).max(10).required(),
  reviewId: Joi.string().uuid().required(),
})

const updateCriteriaSchema = Joi.object().keys({
  criteriaType: Joi.string().valid(...Object.values(CriteriaType)),
  score: Joi.number().min(0).max(10),
})

export { createCriteriaSchema, updateCriteriaSchema }
