import { Router } from "express"
import essayController from "./essay.controller"
import { validate } from "../../middlewares/validate"
import schema from "./essay.schema"
import correctSchema from "./essay-correct.schema"

const router = Router()

router.get("/", essayController.index)
router.post("/", validate(schema.createEssaySchema), essayController.create)
router.post(
  "/correct",
  validate(correctSchema.correctEssaySchema),
  essayController.correctAndSave,
)
router.get("/user/:userId/recent", essayController.getRecent)
router.get("/:id", essayController.read)
router.get("/:id/review", essayController.getEssayWithReview)
router.put("/:id", validate(schema.updateEssaySchema), essayController.update)
router.delete("/:id", essayController.remove)

export default router
