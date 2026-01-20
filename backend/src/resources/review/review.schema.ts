import Joi from "joi"

const createReviewSchema = Joi.object().keys({
  essayId: Joi.string().uuid().length(36).required(),
  score: Joi.number().min(0).max(100).required(),
  modelVersion: Joi.string().max(100).required(),
})

const updateReviewSchema = Joi.object().keys({
  score: Joi.number().min(0).max(100).optional(),
  modelVersion: Joi.string().max(100).optional(),
})

export default {
  create: createReviewSchema,
  update: updateReviewSchema,
}
