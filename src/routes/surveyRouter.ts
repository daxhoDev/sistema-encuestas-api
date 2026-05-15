import { Router } from "express";
import SurveyController from "../controllers/surveyController.js";
import answerRouter from "./answerRouter.js";
import SurveyRepository from "../repositories/surveyRepository.js";
import SurveyService from "../services/surveyService.js";
import UrlController from "../controllers/urlController.js";

const router: Router = Router();

const surveyRepository = new SurveyRepository();
const surveyService = new SurveyService(surveyRepository);
const surveyController = new SurveyController(surveyService);

const urlController = new UrlController();

router.use("/:slug/answers", answerRouter);

router
  .route("/")
  .get(
    urlController.validateQueryStrings.bind(urlController),
    surveyController.getAll.bind(surveyController),
  )
  .post(surveyController.createOne);

router
  .route("/:slug/")
  .get(surveyController.getBySlug.bind(surveyController))
  .patch(surveyController.updateOneBySlug.bind(surveyController))
  .delete(surveyController.deleteOneBySlug.bind(surveyController));

export default router;
