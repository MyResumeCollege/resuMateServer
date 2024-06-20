import { Router } from "express";
import CvUploader from "./cvUploader";

// Export the base-router
const baseRouter = Router();

baseRouter.use("/cv-uploader", CvUploader);

export default baseRouter;
