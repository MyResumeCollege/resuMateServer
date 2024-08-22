import { Router } from 'express'
import CvUploader from './cvUploader'
import CvGenerator from './cvGenerator'
import cvPreview from './cvRoute'
import linkedinProfile from './linkedinData'
import user from './user'
import authRoute from './auth'
import CvRoute from './cvRoute'

// Export the base-router
const baseRouter = Router()

baseRouter.use('/resume', CvUploader, CvGenerator, CvRoute)
baseRouter.use('/linkedin', linkedinProfile)
baseRouter.use('/auth', authRoute)
baseRouter.use('/user', user)
baseRouter.use('/preview', cvPreview)

export default baseRouter
