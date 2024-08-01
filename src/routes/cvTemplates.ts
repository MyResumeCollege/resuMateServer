import express from 'express'
import CvTemplateController from '../controllers/cvTemplates.controller'

const router = express.Router()
router.get('/get-templates', CvTemplateController.getTemplates)
router.post('/add-template', CvTemplateController.addTemplate)
export default router
