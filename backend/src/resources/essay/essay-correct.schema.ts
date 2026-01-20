import Joi from "joi"

const correctEssaySchema = Joi.object().keys({
  userId: Joi.string().uuid().length(36).required(),
  proposalId: Joi.string().uuid().length(36).required(),
  text: Joi.string().min(1).required(),
})

export default { correctEssaySchema }
