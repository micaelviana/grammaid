import Joi from "joi"
import { LanguageTypes } from "./languages.constanst"

export const languageScheme = Joi.object().keys({
  lang: Joi.string().valid(...Object.values(LanguageTypes)),
})
