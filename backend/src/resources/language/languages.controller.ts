import { Request, Response, NextFunction } from "express"
const changeCookieValue = (req: Request, res: Response, next: NextFunction) => {
  const { lang } = req.body
  res.cookie("lang", lang).json({ lang })
}

const deleteCookieValue = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("lang").json({ msg: "cookie deleted" })
}

export default { changeCookieValue, deleteCookieValue }
