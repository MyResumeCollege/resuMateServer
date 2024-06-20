import express from "express";
import cvUploaderController from "../controllers/CvUploader.controller"
import upload from '../middlewares/multerConfig';

const router = express.Router();

router.post(
  "/upload-cv",
  upload.single('file'),
  cvUploaderController.convertPdfToText
);

export default router;