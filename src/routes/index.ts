import { Router } from 'express'
import CvUploader from './cvUploader'
import CvGenerator from './cvGenerator'
import cvPreview from './cvPreview'
import linkedinProfile from './linkedinData'
import user from './user'
import authRoute from './auth'
import CvTranslator from './cvTranslator'
import CvSave from './cvSave'
import templates from './cvTemplates'

// Export the base-router
const baseRouter = Router()

baseRouter.use('/cv', CvUploader, CvGenerator, CvTranslator, CvSave)
baseRouter.use('/templates', templates)
baseRouter.use('/linkedin', linkedinProfile)
baseRouter.use('/auth', authRoute)
baseRouter.use('/user', user)
baseRouter.use('/preview', cvPreview)

export default baseRouter
