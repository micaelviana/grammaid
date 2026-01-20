import { PrismaClient } from "../../generated/prisma"

const prisma = new PrismaClient()

interface N8nError {
  type: string
  description: string
  suggestion: string
  startingPos: number
  endingPos: number
}

interface N8nCriteria {
  type: "CONTENT" | "ORGANIZATION" | "GRAMMAR"
  score: number
  errors: N8nError[]
}

interface N8nResponse {
  suggestedText: string
  modelVersion: string
  criteria: N8nCriteria[]
}

export const createReviewWithDetails = async (
  essayId: string,
  n8nResponse: N8nResponse,
) => {
  // Calcular a pontuação média das 3 categorias
  const contentScore =
    n8nResponse.criteria.find((c) => c.type === "CONTENT")?.score || 0
  const organizationScore =
    n8nResponse.criteria.find((c) => c.type === "ORGANIZATION")?.score || 0
  const grammarScore =
    n8nResponse.criteria.find((c) => c.type === "GRAMMAR")?.score || 0

  const overallScore = (contentScore + organizationScore + grammarScore) / 3

  const review = await prisma.$transaction(async (tx) => {
    const createdReview = await tx.review.create({
      data: {
        essayId,
        score: overallScore,
        suggestedText: n8nResponse.suggestedText,
        modelVersion: n8nResponse.modelVersion,
      },
    })

    // Criar Criteria e Erros para cada categoria
    for (const criteriaData of n8nResponse.criteria) {
      const createdCriteria = await tx.criteria.create({
        data: {
          reviewId: createdReview.id,
          criteriaType: criteriaData.type,
          score: criteriaData.score,
        },
      })

      // Se houver erros para essa categoria, criar os erros
      if (criteriaData.errors.length > 0) {
        await tx.error.createMany({
          data: criteriaData.errors.map((error) => ({
            reviewId: createdReview.id,
            criteriaId: createdCriteria.id,
            errorType: error.type as any,
            description: error.description,
            suggestion: error.suggestion,
            startingPos: error.startingPos,
            endingPos: error.endingPos,
          })),
        })
      }
    }

    // Retornar revisão com todas as relações
    return await tx.review.findUnique({
      where: { id: createdReview.id },
      include: {
        Criteria: {
          include: {
            Error: true,
          },
        },
      },
    })
  })

  return review
}
