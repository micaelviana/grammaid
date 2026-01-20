import Joi from "joi"
import { EssayStatus } from "./essay.constants"

const createEssaySchema = Joi.object().keys({
  userId: Joi.string().uuid().length(36).required(),
  proposalId: Joi.string().uuid().length(36).required(),
  text: Joi.string().min(1).required(),
  status: Joi.string()
    .valid(...Object.values(EssayStatus))
    .required(),
})

const updateEssaySchema = Joi.object().keys({
  text: Joi.string().min(1).optional(),
  status: Joi.string()
    .valid(...Object.values(EssayStatus))
    .optional(),
})

export default { createEssaySchema, updateEssaySchema }
