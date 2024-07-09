import { Router } from 'express';
import CvUploader from './cvUploader';
import CvGenerator from './cvGenerator';
import linkedinProfile from './linkedinData';
import authRoute from "./auth";

// Export the base-router
const baseRouter = Router();

baseRouter.use('/cv', CvUploader, CvGenerator);
baseRouter.use('/linkedin', linkedinProfile);
baseRouter.use("/auth", authRoute);

export default baseRouter;
