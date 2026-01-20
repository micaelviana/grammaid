import { CreateUserDTO, UserDTO } from "./user.types"
import { PrismaClient } from "../../generated/prisma/"
import getEnv from "../../utils/getEnv"
import { genSalt, hash } from "bcryptjs"

const prisma = new PrismaClient()
const env = getEnv()

export const getUser = async (id: string): Promise<UserDTO | null> => {
  const completeUser = await prisma.user.findUnique({
    where: { id },
  })

  if (!completeUser) return null

  const { password, ...user } = completeUser
  return user
}

export const getUsers = async (): Promise<UserDTO[]> => {
  const users = await prisma.user.findMany()
  return users.map(({ password, ...user }: any) => user)
}

export const createUser = async (data: CreateUserDTO): Promise<UserDTO> => {
  const salt = await genSalt(env.BCRYPT_ROUNDS)
  const passwd = await hash(data.password, salt)
  const { password, ...user } = await prisma.user.create({
    data: { ...data, password: passwd },
  })
  return user
}

export const removeUser = async (id: string): Promise<UserDTO | null> => {
  try {
    const user = await prisma.user.delete({
      where: { id },
    })
    return user
  } catch (e) {
    console.log(e)
    return null
  }
}

export const updateUser = async (
  id: string,
  data: CreateUserDTO,
): Promise<UserDTO | null> => {
  const salt = await genSalt(env.BCRYPT_ROUNDS)
  const passwd = await hash(data.password, salt)
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { ...data, password: passwd },
    })
    return user
  } catch (e) {
    console.log(e)
    return null
  }
}
