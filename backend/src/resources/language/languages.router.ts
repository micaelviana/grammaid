import { Router } from "express"
import languagesController from "./languages.controller"
import { validate } from "../../middlewares/validate"
import { languageScheme } from "./language.schema"

const router = Router()
router.put("/", validate(languageScheme), languagesController.changeCookieValue)
router.delete("/", languagesController.deleteCookieValue)

export default router
