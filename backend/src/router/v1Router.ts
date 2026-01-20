import Router from "express"
import authRouter from "../resources/auth/auth.router"
import userRouter from "../resources/user/user.router"
import proposalRouter from "../resources/proposal/proposal.router"
import essayRouter from "../resources/essay/essay.router"
import reviewRouter from "../resources/review/review.router"
import criteriaRouter from "../resources/criteria/criteria.router"
import errorRouter from "../resources/error/error.router"
import languageRouter from "../resources/language/languages.router"
import promotionRouter from "../resources/promotion/promotion.router"
const router = Router()

router.use("/", authRouter)
router.use("/user", userRouter)
router.use("/proposal", proposalRouter)
router.use("/essay", essayRouter)
router.use("/review", reviewRouter)
router.use("/criteria", criteriaRouter)
router.use("/error", errorRouter)
router.use("/language", languageRouter)
router.use("/promotion", promotionRouter)

export default router
