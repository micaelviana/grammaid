import { Router } from "express"
import controller from "./criteria.controller"
import { validate } from "../../middlewares/validate"
import { createCriteriaSchema, updateCriteriaSchema } from "./criteria.schema"

const router = Router()

//acho que listar todos os critérios nao faz muito sentido, mas vou manter o padrao
router.get("/", controller.index)
//vao ser 3 registros por review
router.post("/", validate(createCriteriaSchema), controller.create)
router.get("/review/:reviewId", controller.getByReview)
router.get("/:id", controller.read)
router.put("/:id", validate(updateCriteriaSchema), controller.update)
router.delete("/:id", controller.remove)

export default router
