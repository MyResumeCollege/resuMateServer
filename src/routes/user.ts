import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:id/set-premium", userController.setPremium);
router.get("/:id/is-premium", authMiddleware, userController.checkIfPremium);
router.get("/:userId/resume-ids", userController.getUserResumeIds);
router.get("/:userId/resume-previews", userController.getResumePreviews);
router.get("/", userController.getAllUsers);

export default router;
