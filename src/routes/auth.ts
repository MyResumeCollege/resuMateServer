import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/logout", authController.logoutUser);
router.post("/register", authController.registerUser);
router.post("/google", authController.logInGoogle);

export default router;
