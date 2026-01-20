import { Request, Response } from "express"
import { CreateUserDTO } from "./user.types"
import {
  createUser,
  getUser,
  getUsers,
  removeUser,
  updateUser,
} from "./user.service"
import { ReasonPhrases, StatusCodes } from "http-status-codes"

const index = async (req: Request, res: Response) => {
  const users = await getUsers()
  res.json(users)
}
const create = async (req: Request, res: Response) => {
  const data = req.body as CreateUserDTO
  try {
    const user = await createUser(data)
    res.json(user)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
  }
}

const read = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "ID é obrigatório",
    })
  }

  try {
    const user = await getUser(id)
    res.json(user)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err)
  }
}

const remove = async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "ID é obrigatório",
    })
  }

  try {
    const user = await removeUser(id)
    res.status(StatusCodes.OK).json({ message: "Usuário removido com sucesso" })
  } catch (err) {
    console.log(err)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const update = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = req.body as CreateUserDTO

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "ID é obrigatório",
    })
  }

  try {
    const updatedUser = await updateUser(id, data)
    res.status(StatusCodes.OK).json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    })
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

export default { index, create, read, remove, update }
