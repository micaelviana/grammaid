import { Review } from "../../generated/prisma"

export type CreateReviewDTO = Pick<
  Review,
  "essayId" | "score" | "suggestedText" | "modelVersion"
>

export type UpdateReviewDTO = Partial<Pick<Review, "score" | "modelVersion">>

export type ReviewDTO = Review
