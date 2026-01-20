import { PrismaClient } from "../../generated/prisma"
import { CreateEssayDTO, UpdateEssayDTO } from "./essay.types"

const prisma = new PrismaClient()

export const getAllEssays = async () => {
  try {
    return await prisma.essay.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, level: true } },
        proposal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getEssaysByUser = async (userId: string) => {
  try {
    return await prisma.essay.findMany({
      where: { userId },
      include: {
        proposal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getEssaysByProposal = async (proposalId: string) => {
  try {
    return await prisma.essay.findMany({
      where: { proposalId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getEssayById = async (id: string) => {
  try {
    return await prisma.essay.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
          },
        },
        proposal: true,
      },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const createEssay = async (data: CreateEssayDTO) => {
  try {
    return await prisma.essay.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
          },
        },
        proposal: true,
      },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updateEssay = async (id: string, data: UpdateEssayDTO) => {
  try {
    return await prisma.essay.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            level: true,
          },
        },
        proposal: true,
      },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const deleteEssay = async (id: string) => {
  try {
    return await prisma.essay.delete({
      where: { id },
    })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getRecentEssaysByUser = async (userId: string) => {
  try {
    return await prisma.essay.findMany({
      where: { userId },
      include: {
        proposal: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    })
  } catch (error) {
    console.error(error)
    return null
  }
}
