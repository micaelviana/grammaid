import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import {
  createCriteria,
  deleteCriteria,
  getAllCriteria,
  getCriteriaById,
  getCriteriaByReviewId,
  updateCriteria,
} from "./criteria.service"

const index = async (req: Request, res: Response) => {
  try {
    const criteria = await getAllCriteria()
    if (criteria === null) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.OK).json(criteria)
  } catch (error) {
    console.error("Error in criteria index:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const criteria = await createCriteria(req.body)
    if (criteria === null) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.CREATED).json(criteria)
  } catch (error) {
    console.error("Error in criteria create:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const criteria = await getCriteriaById(id)
    if (criteria === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(criteria)
  } catch (error) {
    console.error("Error in criteria read:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const criteria = await updateCriteria(id, req.body)
    if (criteria === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(criteria)
  } catch (error) {
    console.error("Error in criteria update:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const criteria = await deleteCriteria(id)
    if (criteria === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    console.error("Error in criteria remove:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const getByReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id as string
    const criteria = await getCriteriaByReviewId(reviewId)
    if (criteria === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(criteria)
  } catch (error) {
    console.error("Error in criteria getByReview:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

export default { index, create, read, update, remove, getByReview }
