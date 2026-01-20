import { LanguageTypes } from "../resources/language/languages.constanst"
import { Request, Response, NextFunction } from "express"

export function createLanguageCookie() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!("lang" in req.cookies)) {
      res.cookie("lang", LanguageTypes.ptBR)
    }
    next()
  }
}
