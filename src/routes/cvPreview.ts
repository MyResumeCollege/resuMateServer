import express from "express";
import cvPreview from "../controllers/cvPreview.controller";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/generate-cv", cvPreview.generateCV);

router.post("/generate-preview-url", cvPreview.setUrlForPreview);

router.get("/:id", cvPreview.getPreviewCV);

export default router;
