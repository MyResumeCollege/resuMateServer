import { Router } from 'express'
import CvUploader from './cvUploader'
import CvGenerator from './cvGenerator'
import linkedinProfile from './linkedinData'
import LoginRouter from './login'

const baseRouter = Router()

baseRouter.use('/cv', CvUploader, CvGenerator)
baseRouter.use('/linkedin', linkedinProfile)
baseRouter.use('/login', LoginRouter)

export default baseRouter
