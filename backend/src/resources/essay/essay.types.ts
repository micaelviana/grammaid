import { Essay } from "../../generated/prisma"

export type CreateEssayDTO = Pick<
  Essay,
  "userId" | "proposalId" | "text" | "status"
>
export type UpdateEssayDTO = Partial<Pick<Essay, "text" | "status">>
export type EssayDTO = Essay
