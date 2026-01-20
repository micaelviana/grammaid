import { PrismaClient, Level } from "../../generated/prisma"
import { CreateProposalDTO, UpdateProposalDTO } from "./proposal.types"

const prisma = new PrismaClient()

export const getProposals = async () => {
  return await prisma.proposal.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const getLatestProposalsByLevel = async (level: Level) => {
  return await prisma.proposal.findMany({
    where: {
      level,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })
}

export const getProposal = async (id: string) => {
  return await prisma.proposal.findUnique({
    where: { id },
  })
}

export const createProposal = async (data: CreateProposalDTO) => {
  return await prisma.proposal.create({
    data,
  })
}

export const updateProposal = async (id: string, data: UpdateProposalDTO) => {
  return await prisma.proposal.update({
    where: { id },
    data,
  })
}

export const removeProposal = async (id: string) => {
  return await prisma.proposal.delete({
    where: { id },
  })
}

export const getRecommendedProposals = async (userLevel: Level) => {
  // Definir o próximo nível
  const levelMap: Record<Level, Level | null> = {
    BASIC: "INTERMEDIATE",
    INTERMEDIATE: "ADVANCED",
    ADVANCED: null,
  }

  const nextLevel = levelMap[userLevel]

  // Buscar propostas do nível do usuário
  const userLevelProposals = await prisma.proposal.findMany({
    where: { level: userLevel },
    orderBy: { createdAt: "desc" },
    take: 1,
  })

  // Se for ADVANCED, retornar 3 propostas de ADVANCED
  if (!nextLevel) {
    const additionalProposals = await prisma.proposal.findMany({
      where: { level: userLevel },
      orderBy: { createdAt: "desc" },
      skip: 2,
      take: 1,
    })
    return [...userLevelProposals, ...additionalProposals]
  }

  // Buscar 2 propostas do próximo nível
  const nextLevelProposals = await prisma.proposal.findMany({
    where: { level: nextLevel },
    orderBy: { createdAt: "desc" },
    take: 2,
  })

  return [...userLevelProposals, ...nextLevelProposals]
}
