import express from "express";
import cvUploaderController from "../controllers/cvUploader.controller";
import upload from "../middlewares/multerConfig";

const router = express.Router();

router.post(
  "/upload-resume",
  upload.single("file"),
  cvUploaderController.generateResumeFromExistCV
);

export default router;
