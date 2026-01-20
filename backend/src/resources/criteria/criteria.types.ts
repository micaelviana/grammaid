import { Criteria } from "../../generated/prisma"

export type CreateCriteriaDTO = Pick<
  Criteria,
  "criteriaType" | "score" | "reviewId"
>

export type UpdateCriteriaDTO = Partial<
  Pick<Criteria, "criteriaType" | "score">
>

export type CriteriaDTO = Criteria
