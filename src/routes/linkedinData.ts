import express from "express";
import linkedinController from "../controllers/linkedin.controller";

const router = express.Router();

router.post(
  "/profile-data",
  linkedinController.fetchLinkedinProfileData
);

export default router;
