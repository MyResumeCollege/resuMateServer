import express from "express";
import cvController from "../controllers/cvController";

const router = express.Router();

router.post("/download-cv", cvController.downloadCV);
router.post("/create-preview/:id?", cvController.updatePreviewModelAndSetUrlForPreview);
router.get("/:id", cvController.getPreviewCV);

export default router;
