import { Request, Response } from "express"
import { checkCredentials } from "./auth.service"
import { LoginDTO, SignUPDTO } from "./auth.types"
import { UserTypes } from "../userType/userType.constants"
import { createUser, getUser } from "../user/user.service"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

const signup = async (req: Request, res: Response) => {
  const data = req.body as SignUPDTO
  try {
    const user = await createUser({ ...data, typeId: UserTypes.student })
    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}
const login = async (req: Request, res: Response) => {
  const data = req.body as LoginDTO
  try {
    const user = await checkCredentials(data)
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(ReasonPhrases.UNAUTHORIZED)
    req.session.userType = user.typeId
    req.session.userId = user.id
    res.status(StatusCodes.OK).json({
      userId: user.id,
      userType: user.typeId,
      userName: user.name,
      email: user.email,
      userLevel: user.level,
    })
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

const logout = async (req: Request, res: Response) => {
  delete req.session.userId
  delete req.session.userType
  res.status(StatusCodes.OK).json(ReasonPhrases.OK)
}

const me = async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED)
  }

  const user = await getUser(req.session.userId)
  if (user) {
    res.status(StatusCodes.OK).json({
      userId: user.id,
      userType: user.typeId,
      userName: user.name,
      email: user.email,
      userLevel: user.level,
    })
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json(ReasonPhrases.UNAUTHORIZED)
  }
}

export default { login, logout, signup, me }
