import { Router } from "express";
import AnswerController from "../controllers/answerController.js";

const router: Router = Router({ mergeParams: true });
const answerController = new AnswerController();

router.route("/").get(answerController.getAll);

export default router;
