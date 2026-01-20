import { Router } from "express"
import reviewController from "./review.controller"
import { validate } from "../../middlewares/validate"
import schema from "./review.schema"

const router = Router()

router.get("/", reviewController.index)
router.post("/", validate(schema.create), reviewController.create)
router.get("/essay/:essayId", reviewController.getByEssay)
router.get("/:id", reviewController.read)
router.put("/:id", validate(schema.update), reviewController.update)
router.delete("/:id", reviewController.remove)

export default router
