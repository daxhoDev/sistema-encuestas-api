import { Router } from "express";
import AuthController from "../controllers/authController.js";
import AuthService from "../services/authService.js";
import UserRepository from "../repositories/userRepository.js";

const router: Router = Router();
const userRepo = new UserRepository();
const userService = new AuthService(userRepo);
const authController = new AuthController(userService);

router.post("/signup", authController.signup.bind(authController));

router.post("/login", authController.login.bind(authController));

export default router;
