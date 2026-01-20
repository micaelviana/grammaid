import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import {
  getAllEssays,
  createEssay,
  getEssaysByUser,
  getEssaysByProposal,
  getEssayById,
  updateEssay,
  deleteEssay,
  getRecentEssaysByUser,
} from "./essay.service"
import { EssayStatus } from "./essay.constants"
import { callN8nCorrection } from "../../services/n8n.service"
import { createReviewWithDetails } from "../review/review-batch.service"
import { checkAndPromoteUser } from "../promotion/promotion.service"
import { PrismaClient } from "../../generated/prisma"

const prisma = new PrismaClient()

const index = async (req: Request, res: Response) => {
  try {
    const { userId, proposalId } = req.query

    let essays

    if (userId && typeof userId === "string") {
      essays = await getEssaysByUser(userId)
    } else if (proposalId && typeof proposalId === "string") {
      essays = await getEssaysByProposal(proposalId)
    } else {
      essays = await getAllEssays()
    }

    if (!essays) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

    res.status(StatusCodes.OK).json(essays)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const essay = await createEssay(req.body)

    if (!essay) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

    res.status(StatusCodes.CREATED).json(essay)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const essay = await getEssayById(id)

    if (!essay) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json(essay)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const essay = await updateEssay(id, req.body)

    if (!essay) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json(essay)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const essay = await deleteEssay(id)

    if (!essay) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }

    res.status(StatusCodes.NO_CONTENT).json(ReasonPhrases.NO_CONTENT)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const getRecent = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "ID do usuário é obrigatório",
      })
    }

    const essays = await getRecentEssaysByUser(userId)

    if (!essays) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

    res.status(StatusCodes.OK).json(essays)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const correctAndSave = async (req: Request, res: Response) => {
  try {
    const { userId, proposalId, text } = req.body

    // Buscar dados do Proposal para enviar ao n8n
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { title: true, text: true },
    })

    if (!proposal) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "error", message: "Proposal not found" })
    }

    // Criar essay com status SUBMITTED
    const essay = await createEssay({
      userId,
      proposalId,
      text,
      status: EssayStatus.SUBMITTED,
    })

    if (!essay) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", message: "Failed to create essay" })
    }

    try {
      // Chamar n8n para correção com contexto do proposal
      const n8nResponse = await callN8nCorrection(
        text,
        proposal.title,
        proposal.text,
      )

      // criar review com critérios e erros
      const review = await createReviewWithDetails(essay.id, n8nResponse)

      if (!review) {
        throw new Error("Failed to create review")
      }

      // atualizar o essay para REVIEWED se ele estiver sido corrigido
      await updateEssay(essay.id, { status: EssayStatus.REVIEWED })

      // checa promotion e retorna resultado
      const promotionResult = await checkAndPromoteUser(userId)

      // Retornar sucesso com o resultado da promoção
      res.status(StatusCodes.CREATED).json({
        essayId: essay.id,
        reviewId: review.id,
        score: review.score,
        status: "success",
        promotion: promotionResult,
      })
    } catch (n8nError: any) {
      console.error("Error during correction process:", n8nError)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        essayId: essay.id,
        status: "error",
        message:
          n8nError.message ||
          "Error processing correction. Essay saved as SUBMITTED.",
      })
    }
  } catch (error) {
    console.error("Error in correctAndSave:", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to process essay correction",
    })
  }
}

const getEssayWithReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const essay = await prisma.essay.findUnique({
      where: { id },
      include: {
        proposal: true,
        user: { select: { id: true, name: true, level: true } },
        Review: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            Criteria: {
              include: {
                Error: true,
              },
            },
          },
        },
      },
    })

    if (!essay) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Essay not found",
      })
    }

    if (!essay.Review || essay.Review.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No review found for this essay",
      })
    }

    const review = essay.Review[0] // Get the most recent review
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No review found for this essay",
      })
    }

    res.status(StatusCodes.OK).json({
      essay: {
        id: essay.id,
        text: essay.text,
        status: essay.status,
        createdAt: essay.createdAt,
        proposal: essay.proposal,
        user: essay.user,
      },
      review: {
        id: review.id,
        score: review.score,
        suggestedText: review.suggestedText,
        modelVersion: review.modelVersion,
        createdAt: review.createdAt,
        criteria: review.Criteria,
      },
    })
  } catch (error) {
    console.error("Error in getEssayWithReview:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

export default {
  index,
  create,
  read,
  update,
  remove,
  getRecent,
  correctAndSave,
  getEssayWithReview,
}
