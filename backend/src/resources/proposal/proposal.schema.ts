import Joi from "joi"
import { CreateProposalDTO } from "./proposal.types"

export const createProposalSchema = Joi.object<CreateProposalDTO>({
  title: Joi.string().max(100).required().messages({
    "string.empty": "Título é obrigatório",
    "string.max": "Título deve ter no máximo 100 caracteres",
    "any.required": "Título é obrigatório",
  }),

  text: Joi.string().required().messages({
    "string.empty": "Texto é obrigatório",
    "any.required": "Texto é obrigatório",
  }),

  level: Joi.string()
    .valid("BASIC", "INTERMEDIATE", "ADVANCED")
    .required()
    .messages({
      "string.empty": "Nível é obrigatório",
      "any.only": "Nível deve ser BASIC, INTERMEDIATE ou ADVANCED",
      "any.required": "Nível é obrigatório",
    }),

  minWords: Joi.number().integer().min(1).required().messages({
    "number.base": "Número mínimo de palavras deve ser um número",
    "number.integer": "Número mínimo de palavras deve ser um número inteiro",
    "number.min": "Número mínimo de palavras deve ser maior que 0",
    "any.required": "Número mínimo de palavras é obrigatório",
  }),

  imageUrl: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "URL da imagem deve ser uma URL válida",
  }),
})

export const updateProposalSchema = Joi.object<CreateProposalDTO>({
  title: Joi.string().max(100).messages({
    "string.max": "Título deve ter no máximo 100 caracteres",
  }),

  text: Joi.string(),

  level: Joi.string().valid("BASIC", "INTERMEDIATE", "ADVANCED").messages({
    "any.only": "Nível deve ser BASIC, INTERMEDIATE ou ADVANCED",
  }),

  minWords: Joi.number().integer().min(1).messages({
    "number.base": "Número mínimo de palavras deve ser um número",
    "number.integer": "Número mínimo de palavras deve ser um número inteiro",
    "number.min": "Número mínimo de palavras deve ser maior que 0",
  }),

  imageUrl: Joi.string().uri().allow(null, "").optional().messages({
    "string.uri": "URL da imagem deve ser uma URL válida",
  }),
})
