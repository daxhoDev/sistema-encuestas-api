import { Router } from "express";
import AnswerController from "../controllers/answerController.js";
import AnswerService from "../services/answerService.js";
import AnswerRepository from "../repositories/answerRepository.js";

const router: Router = Router({ mergeParams: true });
const answerRepository = new AnswerRepository();
const answerService = new AnswerService(answerRepository);
const answerController = new AnswerController(answerService);

router.route("/").get(answerController.getAllFromSurvey);

export default router;
