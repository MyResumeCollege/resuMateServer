import express from 'express';
import cvTranslatorController from '../controllers/cvTranslator.controller';
import upload from '../middlewares/multerConfig';

const router = express.Router();

router.post(
  '/translate-resume',
  cvTranslatorController.translateGeneratedResume
);

export default router;
