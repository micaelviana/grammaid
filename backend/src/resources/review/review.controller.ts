import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import {
  getAllReviews,
  getReviewById,
  getReviewsByEssayId,
  createReview,
  updateReview,
  deleteReview,
} from "./review.service"

const index = async (req: Request, res: Response) => {
  try {
    const reviews = await getAllReviews()
    if (!reviews) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.OK).json(reviews)
  } catch (error) {
    console.error("Error in index:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const review = await createReview(req.body)
    if (!review) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.CREATED).json(review)
  } catch (error) {
    console.error("Error in create:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const review = await getReviewById(id)
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(review)
  } catch (error) {
    console.error("Error in read:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const review = await updateReview(id, req.body)
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(review)
  } catch (error) {
    console.error("Error in update:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const review = await deleteReview(id)
    if (!review) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error in remove:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const getByEssay = async (req: Request, res: Response) => {
  try {
    const essayId = req.params.essayId as string
    const reviews = await getReviewsByEssayId(essayId)
    if (!reviews) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.OK).json(reviews)
  } catch (error) {
    console.error("Error in getByEssay:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

export default { index, create, read, update, remove, getByEssay }
