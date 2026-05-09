import { Router } from "express";
import SurveyController from "../controllers/surveyController.js";
import answerRouter from "./answerRouter.js";

const router: Router = Router();
const surveyController = new SurveyController();

router.use("/:surveyId/answers", answerRouter);

router.route("/").get(surveyController.getAll);
router.route("/:surveyId/").get(surveyController.getById);

export default router;
