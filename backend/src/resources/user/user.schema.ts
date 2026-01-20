import Joi from "joi"
import { CreateUserDTO } from "./user.types"

export const createUserSchema = Joi.object<CreateUserDTO>({
  name: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Nome é obrigatório",
    "string.min": "Nome deve ter no mínimo 3 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
    "any.required": "Nome é obrigatório",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email é obrigatório",
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "string.empty": "Senha é obrigatória",
    "string.min": "Senha deve ter no mínimo 6 caracteres",
    "string.max": "Senha deve ter no máximo 100 caracteres",
    "any.required": "Senha é obrigatória",
  }),

  level: Joi.string()
    .valid("BASIC", "INTERMEDIATE", "ADVANCED")
    .required()
    .messages({
      "string.empty": "Nível de habilidade é obrigatório",
    }),

  typeId: Joi.number().integer().required().messages({
    "number.base": "Tipo de usuário deve ser um número",
    "number.integer": "Tipo de usuário deve ser um número inteiro",
    "any.required": "Tipo de usuário é obrigatório",
  }),
})
