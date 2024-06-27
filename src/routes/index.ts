import { Router } from 'express';
import CvUploader from './cvUploader';
import CvGenerator from './cvGenerator';
import linkedinProfile from './linkedinData';
import CvTranslator from './cvTranslator';

// Export the base-router
const baseRouter = Router();

baseRouter.use('/cv', CvUploader, CvGenerator, CvTranslator);
baseRouter.use('/linkedin', linkedinProfile);

export default baseRouter;
