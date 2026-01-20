import { PrismaClient } from "../../generated/prisma"
import { CreateErrorDTO, UpdateErrorDTO } from "./error.types"

const prisma = new PrismaClient()

export const getAllErrors = async () => {
  try {
    return await prisma.error.findMany({
      include: {
        criteria: true,
        Review: true,
      },
    })
  } catch (error) {
    console.error("Error fetching all errors:", error)
    return null
  }
}

export const getErrorById = async (id: string) => {
  try {
    return await prisma.error.findUnique({
      where: { id },
      include: {
        criteria: true,
        Review: true,
      },
    })
  } catch (error) {
    console.error(`Error fetching error with id ${id}:`, error)
    return null
  }
}

export const getErrorsByReviewId = async (reviewId: string) => {
  try {
    return await prisma.error.findMany({
      where: { reviewId },
      include: {
        criteria: true,
      },
    })
  } catch (error) {
    console.error(`Error fetching errors for review ${reviewId}:`, error)
    return null
  }
}

export const getErrorsByCriteriaId = async (criteriaId: string) => {
  try {
    return await prisma.error.findMany({
      where: { criteriaId },
    })
  } catch (error) {
    console.error(`Error fetching errors for criteria ${criteriaId}:`, error)
    return null
  }
}

export const createError = async (data: CreateErrorDTO) => {
  try {
    return await prisma.error.create({
      data,
      include: {
        criteria: true,
        Review: true,
      },
    })
  } catch (error) {
    console.error("Error creating error:", error)
    return null
  }
}

export const updateError = async (id: string, data: UpdateErrorDTO) => {
  try {
    return await prisma.error.update({
      where: { id },
      data,
      include: {
        criteria: true,
        Review: true,
      },
    })
  } catch (error) {
    console.error(`Error updating error with id ${id}:`, error)
    return null
  }
}

export const deleteError = async (id: string) => {
  try {
    return await prisma.error.delete({
      where: { id },
    })
  } catch (error) {
    console.error(`Error deleting error with id ${id}:`, error)
    return null
  }
}
