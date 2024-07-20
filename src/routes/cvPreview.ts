import express from 'express';
import cvPreview from '../controllers/cvPreview.controller';

const router = express.Router();

router.post(
  '/cv',
  cvPreview.previewResume
);

export default router;
