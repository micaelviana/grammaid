import { PrismaClient } from "../../generated/prisma"
import { CreateCriteriaDTO, UpdateCriteriaDTO } from "./criteria.types"

const prisma = new PrismaClient()

export const getAllCriteria = async () => {
  try {
    return await prisma.criteria.findMany({
      include: {
        review: true,
      },
    })
  } catch (error) {
    console.error("Error fetching all criteria:", error)
    return null
  }
}

export const getCriteriaById = async (id: string) => {
  try {
    return await prisma.criteria.findUnique({
      where: { id },
      include: {
        review: true,
      },
    })
  } catch (error) {
    console.error(`Error fetching criteria with id ${id}:`, error)
    return null
  }
}

export const getCriteriaByReviewId = async (reviewId: string) => {
  try {
    return await prisma.criteria.findMany({
      where: { reviewId },
    })
  } catch (error) {
    console.error(`Error fetching criteria for review ${reviewId}:`, error)
    return null
  }
}

export const createCriteria = async (data: CreateCriteriaDTO) => {
  try {
    return await prisma.criteria.create({
      data,
      include: {
        review: true,
      },
    })
  } catch (error) {
    console.error("Error creating criteria:", error)
    return null
  }
}

export const updateCriteria = async (id: string, data: UpdateCriteriaDTO) => {
  try {
    return await prisma.criteria.update({
      where: { id },
      data,
      include: {
        review: true,
      },
    })
  } catch (error) {
    console.error(`Error updating criteria with id ${id}:`, error)
    return null
  }
}

export const deleteCriteria = async (id: string) => {
  try {
    return await prisma.criteria.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error deleting criteria with id ${id}:`, error)
    return null
  }
}
