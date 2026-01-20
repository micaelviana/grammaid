import { compare } from "bcryptjs"
import { LoginDTO } from "./auth.types"
import { PrismaClient } from "../../generated/prisma"
import { User } from "../../generated/prisma/"

const prisma = new PrismaClient()

export const checkCredentials = async (
  data: LoginDTO,
): Promise<User | null> => {
  const user = await prisma.user.findFirst({ where: { email: data.email } })
  if (!user) return null

  const ok = await compare(data.password, user.password)
  if (!ok) return null

  return user
}

export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { type: true },
  })

  if (!user) return false

  return user.type.label === "ADMIN"
}
