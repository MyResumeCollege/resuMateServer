import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:id/set-premium", authMiddleware, userController.setPremium);

router.get("/:id/is-premium", authMiddleware, userController.checkIfPremium);

export default router;
