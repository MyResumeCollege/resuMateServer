import express from 'express'
import cvGeneratorController from '../controllers/cvGenerator.controller'
const router = express.Router()

router.post('/generate-resume', cvGeneratorController.generateResumeFromScratch)
router.post('/generate-section', cvGeneratorController.regenerateSectionOnResume)
router.post("/translate/:resumeId/:language", cvGeneratorController.translateGeneratedResume);

export default router
