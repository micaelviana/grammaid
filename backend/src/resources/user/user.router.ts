import { Router } from "express"
import userController from "./user.controller"
import { validate } from "../../middlewares/validate"
import { createUserSchema } from "./user.schema"
import isAdmin from "../../middlewares/isAdmin"

const router = Router()

router.get("/", userController.index)
router.post("/", isAdmin, validate(createUserSchema), userController.create)
router.get("/:id", userController.read)
router.delete("/:id", isAdmin, userController.remove)
router.put("/:id", isAdmin, validate(createUserSchema), userController.update)

export default router
