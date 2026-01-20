import { Level } from "../../generated/prisma"

export interface PromotionResult {
  promoted: boolean
  oldLevel?: Level
  newLevel?: Level
  averageScore?: number
  message?: string
}

export interface ReviewForPromotion {
  score: number
  essay: {
    proposal: {
      level: Level
    }
  }
}

export interface ProgressData {
  currentLevel: Level
  nextLevel: Level | null
  eligibleReviewsCount: number
  requiredReviews: number
  averageScore: number | null
  isEligibleForPromotion: boolean
  message: string
}
