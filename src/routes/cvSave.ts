import express from "express";
import cvSaveController from "../controllers/cvSave.controller";

const router = express.Router();
router.post("/save-resume", cvSaveController.saveCv);

export default router;
