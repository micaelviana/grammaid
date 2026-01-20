import { User } from "../../generated/prisma/"
export type CreateUserDTO = Pick<
  User,
  "name" | "email" | "password" | "level" | "typeId"
>
export type UserDTO = Omit<User, "password">
