import express from 'express'
import cvGeneratorController from '../controllers/cvGenerator.controller'
const router = express.Router()

router.post('/generate-resume', cvGeneratorController.generateResumeFromScratch)

export default router
