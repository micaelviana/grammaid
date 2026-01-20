import { Router } from "express"
import controller from "./error.controller"
import { validate } from "../../middlewares/validate"
import { createErrorSchema, updateErrorSchema } from "./error.schema"

const router = Router()

router.get("/", controller.index)
router.post("/", validate(createErrorSchema), controller.create)
router.get("/review/:reviewId", controller.getByReview)
router.get("/criteria/:criteriaId", controller.getByCriteria)
router.get("/:id", controller.read)
router.put("/:id", validate(updateErrorSchema), controller.update)
router.delete("/:id", controller.remove)

export default router
