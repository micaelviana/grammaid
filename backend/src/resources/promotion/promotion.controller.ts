import { Request, Response } from "express"
import { ReasonPhrases, StatusCodes } from "http-status-codes"
import { getProgressData } from "./promotion.service"

const progress = async (req: Request, res: Response) => {
  const userId = req.session.userId

  if (!userId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: ReasonPhrases.UNAUTHORIZED,
    })
  }

  try {
    const progressData = await getProgressData(userId)

    if (!progressData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
      })
    }

    res.json(progressData)
  } catch (err) {
    console.error("Error in progress controller:", err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    })
  }
}

export default { progress }
