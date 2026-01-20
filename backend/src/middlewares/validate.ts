import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import Joi from "joi"

export const validate =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Retorna todos os erros, não apenas o primeiro
    })

    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Erro de validação",
        errors,
      })
    }
    next()
  }
