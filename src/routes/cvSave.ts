import express from "express";
import cvSaveController from "../controllers/cvSave.controller";

const router = express.Router();
router.get("/get-all-resumes", cvSaveController.getAllResumes);
router.get("/resume/:resumeId", cvSaveController.getResumeById);
router.post("/save-resume", cvSaveController.saveCv);

export default router;
