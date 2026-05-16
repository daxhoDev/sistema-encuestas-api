import { Router } from "express";
import SurveyController from "../controllers/surveyController.js";
import answerRouter from "./answerRouter.js";
import SurveyRepository from "../repositories/surveyRepository.js";
import SurveyService from "../services/surveyService.js";
import UrlController from "../controllers/urlController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router: Router = Router();

const authMiddleware = new AuthMiddleware();
const surveyRepository = new SurveyRepository();
const surveyService = new SurveyService(surveyRepository);
const surveyController = new SurveyController(surveyService);

const urlController = new UrlController();

router.use("/:slug/answers", answerRouter);

router
  .route("/")
  .get(
    authMiddleware.protect.bind(authMiddleware),
    urlController.validateQueryStrings.bind(urlController),
    surveyController.getAll.bind(surveyController),
  )
  .post(
    authMiddleware.protect.bind(authMiddleware),
    authMiddleware.protect.bind(authMiddleware),
    surveyController.createOne.bind(surveyController),
  );

router
  .route("/:slug/")
  .get(surveyController.getBySlug.bind(surveyController))
  .patch(
    authMiddleware.protect.bind(authMiddleware),
    surveyController.updateOneBySlug.bind(surveyController),
  )
  .delete(
    authMiddleware.protect.bind(authMiddleware),
    surveyController.deleteOneBySlug.bind(surveyController),
  );

export default router;
