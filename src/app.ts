import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import BaseRouter from './routes/index'

dotenv.config()

const initApp = async (): Promise<Express> => {
  try {
    const app = express()

    /************************************************************************************
                                    Set basic express settings
     ***********************************************************************************/

    app.use(cors())
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ limit: '10mb', extended: true }))

    app.use('/api', BaseRouter)
    app.use('/public', express.static('public'))

    return app
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`)
  }
}
export default initApp
