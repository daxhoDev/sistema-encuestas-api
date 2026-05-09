import { Router } from "express";
import AuthController from "../controllers/authController.js";

const router: Router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup);

export default router;
