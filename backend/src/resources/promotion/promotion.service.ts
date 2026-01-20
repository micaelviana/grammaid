import { PrismaClient, Level } from "../../generated/prisma"
import { PromotionResult, ProgressData } from "./promotion.types"

const prisma = new PrismaClient()

const levelHierarchy: Record<Level, number> = {
  [Level.BASIC]: 0,
  [Level.INTERMEDIATE]: 1,
  [Level.ADVANCED]: 2,
}

const getNextLevel = (currentLevel: Level): Level | null => {
  if (currentLevel === Level.BASIC) return Level.INTERMEDIATE
  if (currentLevel === Level.INTERMEDIATE) return Level.ADVANCED
  return null // Already at max level
}

// Comparar se o nível da revisão é igual ou superior ao do usuário
const isLevelEqualOrHigher = (
  reviewLevel: Level,
  userLevel: Level,
): boolean => {
  return levelHierarchy[reviewLevel] >= levelHierarchy[userLevel]
}

/* Checar se o usuário deve ser promovido com base nas últimas 10 revisões
 * @param userId - ID do usuário para verificar promoção
 * @returns PromotionResult com status de promoção e detalhes
 * */
export const checkAndPromoteUser = async (
  userId: string,
): Promise<PromotionResult> => {
  try {
    // Get user current level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true },
    })

    if (!user) {
      return {
        promoted: false,
        message: "User not found",
      }
    }

    const currentLevel = user.level

    // Checar se o usuário já está no nível máximo
    const nextLevel = getNextLevel(currentLevel)
    if (!nextLevel) {
      return {
        promoted: false,
        message: "User is already at maximum level",
      }
    }

    // Pegar as 10 últimas revisões do usuário, ordenadas pela data de criação (mais recente primeiro)
    const reviews = await prisma.review.findMany({
      where: {
        essay: {
          userId: userId,
        },
      },
      include: {
        essay: {
          include: {
            proposal: {
              select: {
                level: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    // Filtrar revisões que sejam do nível do usuário ou superior
    const validReviews = reviews.filter((review) =>
      isLevelEqualOrHigher(review.essay.proposal.level, currentLevel),
    )

    // Check if we have at least 10 valid reviews
    if (validReviews.length < 10) {
      return {
        promoted: false,
        message: `Not enough eligible reviews. Found ${validReviews.length}/10 reviews at user level or higher.`,
      }
    }

    const reviewsToConsider = validReviews.slice(0, 10)
    const totalScore = reviewsToConsider.reduce(
      (sum, review) => sum + review.score,
      0,
    )
    const averageScore = totalScore / reviewsToConsider.length

    //Checar se a média da pontuação é >= 75%
    if (averageScore >= 75) {
      // Promote user
      await prisma.user.update({
        where: { id: userId },
        data: { level: nextLevel },
      })

      return {
        promoted: true,
        oldLevel: currentLevel,
        newLevel: nextLevel,
        averageScore: averageScore,
        message: `Congratulations! You have been promoted from ${currentLevel} to ${nextLevel}!`,
      }
    }

    return {
      promoted: false,
      averageScore: averageScore,
      message: `Average score (${averageScore.toFixed(1)}%) is below the required 75% for promotion.`,
    }
  } catch (error) {
    console.error("Error in checkAndPromoteUser:", error)
    return {
      promoted: false,
      message: "Error checking promotion eligibility",
    }
  }
}

/* Buscar dados de progresso do usuário para exibição
 * @param userId - ID do usuário
 * @returns ProgressData com informações sobre progresso de promoção
 * */
export const getProgressData = async (
  userId: string,
): Promise<ProgressData | null> => {
  try {
    // Get user current level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true },
    })

    if (!user) {
      return null
    }

    const currentLevel = user.level
    const nextLevel = getNextLevel(currentLevel)
    const requiredReviews = 10

    // Se já está no nível máximo
    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: null,
        eligibleReviewsCount: 0,
        requiredReviews,
        averageScore: null,
        isEligibleForPromotion: false,
        message: "Você já atingiu o nível máximo!",
      }
    }

    // Buscar todas as revisões do usuário
    const reviews = await prisma.review.findMany({
      where: {
        essay: {
          userId: userId,
        },
      },
      include: {
        essay: {
          include: {
            proposal: {
              select: {
                level: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Filtrar revisões elegíveis (nível do usuário ou superior)
    const eligibleReviews = reviews.filter((review) =>
      isLevelEqualOrHigher(review.essay.proposal.level, currentLevel),
    )

    const eligibleReviewsCount = eligibleReviews.length

    // Calcular média se houver revisões elegíveis
    let averageScore: number | null = null
    if (eligibleReviewsCount > 0) {
      // Pegar as 10 últimas revisões do usuário, ordenadas pela data de criação (mais recente primeiro)
      const reviewsToConsider = eligibleReviews.slice(0, requiredReviews)
      const totalScore = reviewsToConsider.reduce(
        (sum, review) => sum + review.score,
        0,
      )
      averageScore = totalScore / reviewsToConsider.length
    }

    // Verificar elegibilidade para promoção
    const isEligibleForPromotion =
      eligibleReviewsCount >= requiredReviews &&
      averageScore !== null &&
      averageScore >= 75

    // Gerar mensagem apropriada
    let message: string
    if (isEligibleForPromotion) {
      message = `Parabéns! Você está elegível para promoção ao nível ${nextLevel}!`
    } else if (eligibleReviewsCount < requiredReviews) {
      const remaining = requiredReviews - eligibleReviewsCount
      message = `Continue escrevendo! Faltam ${remaining} ${remaining === 1 ? "redação" : "redações"} elegíveis.`
    } else if (averageScore !== null && averageScore < 75) {
      message = `Você tem redações suficientes, mas precisa melhorar a média (atual: ${averageScore.toFixed(1)}%).`
    } else {
      message = "Continue praticando para subir de nível!"
    }

    return {
      currentLevel,
      nextLevel,
      eligibleReviewsCount,
      requiredReviews,
      averageScore,
      isEligibleForPromotion,
      message,
    }
  } catch (error) {
    console.error("Error in getProgressData:", error)
    return null
  }
}
