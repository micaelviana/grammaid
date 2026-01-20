import { Router } from "express"
import proposalController from "./proposal.controller"
import { validate } from "../../middlewares/validate"
import { createProposalSchema, updateProposalSchema } from "./proposal.schema"
import isAdmin from "../../middlewares/isAdmin"

const router = Router()

router.get("/", proposalController.index)
router.get("/recommendations", proposalController.getRecommendations)
router.post(
  "/",
  isAdmin,
  validate(createProposalSchema),
  proposalController.create,
)
router.get("/:id", proposalController.read)
router.put(
  "/:id",
  isAdmin,
  validate(updateProposalSchema),
  proposalController.update,
)
router.delete("/:id", isAdmin, proposalController.remove)

export default router
