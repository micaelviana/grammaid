import { Router } from "express"
import promotionController from "./promotion.controller"

const router = Router()

router.get("/progress", promotionController.progress)

export default router
