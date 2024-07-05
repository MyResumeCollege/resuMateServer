import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/login", (req, res) => {});
router.post("/google", authController.logInGoogle);

export default router;
