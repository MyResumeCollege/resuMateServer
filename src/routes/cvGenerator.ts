import express from 'express'
import cvGeneratorController from '../controllers/cvGenerator.controller'
const router = express.Router()

router.post('/generate-resume', cvGeneratorController.generateResumeFromScratch)
router.post('/generate-section', cvGeneratorController.generateSection)

export default router
