import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import {
  createError,
  deleteError,
  getAllErrors,
  getErrorById,
  getErrorsByCriteriaId,
  getErrorsByReviewId,
  updateError,
} from "./error.service"

const index = async (req: Request, res: Response) => {
  try {
    const errors = await getAllErrors()
    if (errors === null) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.OK).json(errors)
  } catch (error) {
    console.error("Error in error index:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const create = async (req: Request, res: Response) => {
  try {
    const error = await createError(req.body)
    if (error === null) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
    res.status(StatusCodes.CREATED).json(error)
  } catch (error) {
    console.error("Error in error create:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const read = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const error = await getErrorById(id)
    if (error === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(error)
  } catch (error) {
    console.error("Error in error read:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const error = await updateError(id, req.body)
    if (error === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(error)
  } catch (error) {
    console.error("Error in error update:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const error = await deleteError(id)
    if (error === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.NO_CONTENT).json(ReasonPhrases.NO_CONTENT)
  } catch (error) {
    console.error("Error in error remove:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const getByReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.id as string
    const errors = await getErrorsByReviewId(reviewId)
    if (errors === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(errors)
  } catch (error) {
    console.error("Error in error getByReview:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

const getByCriteria = async (req: Request, res: Response) => {
  try {
    const criteriaId = req.params.id as string
    const errors = await getErrorsByCriteriaId(criteriaId)
    if (errors === null) {
      return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
    }
    res.status(StatusCodes.OK).json(errors)
  } catch (error) {
    console.error("Error in error getByCriteria:", error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ReasonPhrases.INTERNAL_SERVER_ERROR)
  }
}

export default {
  index,
  create,
  read,
  update,
  remove,
  getByReview,
  getByCriteria,
}
