import express from "express";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:id/set-premium", userController.setPremium);
router.get("/:id/is-premium", authMiddleware, userController.checkIfPremium);
router.get("/:userId/resume-previews", userController.getResumePreviews);
router.get("/:userId/:id", userController.getResumeUrl)

router.post("/:userId/upsert", userController.upsertCv);
router.delete("/:userId/:resumeId", userController.deleteCv);

export default router;
