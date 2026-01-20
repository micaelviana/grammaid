import { PrismaClient } from "../../generated/prisma"
import { CreateReviewDTO, UpdateReviewDTO } from "./review.types"

const prisma = new PrismaClient()

export const getAllReviews = async () => {
  try {
    return await prisma.review.findMany({
      include: {
        essay: {
          include: {
            user: { select: { id: true, name: true, level: true } },
            proposal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error("Error fetching essay reviews:", error)
    return null
  }
}

export const getReviewById = async (id: string) => {
  try {
    return await prisma.review.findUnique({
      where: { id },
      include: {
        essay: {
          include: {
            user: { select: { id: true, name: true, level: true } },
            proposal: true,
          },
        },
      },
    })
  } catch (error) {
    console.error(`Error fetching essay review ${id}:`, error)
    return null
  }
}

export const getReviewsByEssayId = async (essayId: string) => {
  try {
    return await prisma.review.findMany({
      where: { essayId },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(`Error fetching reviews for essay ${essayId}:`, error)
    return null
  }
}

export const createReview = async (data: CreateReviewDTO) => {
  try {
    return await prisma.review.create({
      data,
      include: {
        essay: true,
      },
    })
  } catch (error) {
    console.error("Error creating essay review:", error)
    return null
  }
}

export const updateReview = async (id: string, data: UpdateReviewDTO) => {
  try {
    return await prisma.review.update({
      where: { id },
      data,
      include: {
        essay: true,
      },
    })
  } catch (error) {
    console.error(`Error updating essay review ${id}:`, error)
    return null
  }
}

export const deleteReview = async (id: string) => {
  try {
    return await prisma.review.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error deleting essay review ${id}:`, error)
    return null
  }
}
