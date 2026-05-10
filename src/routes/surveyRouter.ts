import { Router } from "express";
import SurveyController from "../controllers/surveyController.js";
import answerRouter from "./answerRouter.js";
import SurveyRepository from "../repositories/surveyRepository.js";
import SurveyService from "../services/surveyService.js";

const router: Router = Router();

const surveyRepository = new SurveyRepository();
const surveyService = new SurveyService(surveyRepository);
const surveyController = new SurveyController(surveyService);

router.use("/:surveyId/answers", answerRouter);

router.route("/").get(surveyController.getAll).post(surveyController.createOne);
router.route("/:slug/").get(surveyController.getBySlug);

export default router;
