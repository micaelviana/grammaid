import { CreateUserDTO } from "../user/user.types"
import { User } from "../../generated/prisma"
export type SignUPDTO = Omit<CreateUserDTO, "typeId">
export type LoginDTO = Pick<User, "email" | "password">
