import { Error } from "../../generated/prisma"

export type CreateErrorDTO = Pick<
  Error,
  | "errorType"
  | "description"
  | "suggestion"
  | "startingPos"
  | "endingPos"
  | "criteriaId"
  | "reviewId"
>

export type UpdateErrorDTO = Partial<
  Pick<
    Error,
    "errorType" | "description" | "suggestion" | "startingPos" | "endingPos"
  >
>

export type ErrorDTO = Error
