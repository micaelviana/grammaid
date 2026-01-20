import { Proposal } from "../../generated/prisma/"

export type CreateProposalDTO = Pick<
  Proposal,
  "title" | "text" | "level" | "minWords" | "imageUrl"
>
export type UpdateProposalDTO = Partial<CreateProposalDTO>
export type ProposalDTO = Proposal
