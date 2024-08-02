import express from "express";
import cvPreview from "../controllers/cvPreview.controller";

const router = express.Router();

router.post("/download-cv", cvPreview.downloadCV);
router.post("/generate-preview-url", cvPreview.setUrlForPreview);
router.get("/:id", cvPreview.getPreviewCV);

export default router;
