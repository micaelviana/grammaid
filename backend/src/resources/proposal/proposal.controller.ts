import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { CreateProposalDTO, UpdateProposalDTO } from "./proposal.types"
import {
  createProposal,
  getProposal,
  getProposals,
  removeProposal,
  updateProposal,
  getRecommendedProposals,
} from "./proposal.service"
import { Level } from "../../generated/prisma"

const index = async (req: Request, res: Response) => {
  try {
    const proposals = await getProposals()
    res.status(StatusCodes.OK).json(proposals)
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const create = async (req: Request, res: Response) => {
  const data = req.body as CreateProposalDTO
  try {
    const proposal = await createProposal(data)
    res.status(StatusCodes.CREATED).json(proposal)
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
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
    const proposal = await getProposal(id)
    if (!proposal) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Proposta não encontrada" })
    }
    res.status(StatusCodes.OK).json(proposal)
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const update = async (req: Request, res: Response) => {
  const { id } = req.params
  const data = req.body as UpdateProposalDTO

  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "ID é obrigatório",
    })
  }

  try {
    const updatedProposal = await updateProposal(id, data)
    res.status(StatusCodes.OK).json({
      message: "Proposta atualizada com sucesso",
      proposal: updatedProposal,
    })
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
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
    await removeProposal(id)
    res
      .status(StatusCodes.OK)
      .json({ message: "Proposta removida com sucesso" })
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const getRecommendations = async (req: Request, res: Response) => {
  const { level } = req.query

  if (!level || typeof level !== "string") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Nível é obrigatório",
    })
  }

  // Validar se o nível é válido
  if (!["BASIC", "INTERMEDIATE", "ADVANCED"].includes(level)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Nível inválido",
    })
  }

  try {
    const proposals = await getRecommendedProposals(level as Level)
    res.status(StatusCodes.OK).json(proposals)
  } catch (error) {
    console.log(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

export default { index, create, read, update, remove, getRecommendations }
