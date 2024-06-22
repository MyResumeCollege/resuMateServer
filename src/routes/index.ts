import { Router } from "express";
import CvUploader from "./cvUploader";
import linkedinProfile from "./linkedinData"

// Export the base-router
const baseRouter = Router();

baseRouter.use("/cv", CvUploader);
baseRouter.use("/linkedin", linkedinProfile)

export default baseRouter;
