import { Router } from "express";
import AnswerController from "../controllers/answerController.js";
import AnswerService from "../services/answerService.js";
import AnswerRepository from "../repositories/answerRepository.js";
import SurveyRepository from "../repositories/surveyRepository.js";

const router: Router = Router({ mergeParams: true });
const answerRepository = new AnswerRepository();
const surveyRepository = new SurveyRepository();
const answerService = new AnswerService(answerRepository, surveyRepository);
const answerController = new AnswerController(answerService);

router
  .route("/")
  .get(answerController.getAllFromSurvey)
  .post(answerController.createOne);

router
  .route("/:id")
  .get(answerController.getById)
  .delete(answerController.deleteById);

export default router;
