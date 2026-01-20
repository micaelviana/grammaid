import { Request, Response, NextFunction } from "express"
import { checkIsAdmin } from "../resources/auth/auth.service"
import { StatusCodes } from "http-status-codes"
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId
  if (userId && (await checkIsAdmin(userId))) next()
  else res.status(StatusCodes.FORBIDDEN).json({ msg: "Não autorizado" })
}
export default isAdmin
