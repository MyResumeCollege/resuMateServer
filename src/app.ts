import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express } from 'express'
import BaseRouter from './routes/index'
import mongoose from 'mongoose'
import path from 'path'
dotenv.config()

const initApp = async (): Promise<Express> => {
  try {
    /************************************************************************************
                                    Set up mongoose connection
     ***********************************************************************************/
    mongoose
      .connect(process.env.DB_STRING_CONNECTION, {
        dbName: process.env.DB_NAME,
      })
      .then(() => {
        console.log('Database connected')
      })
      .catch(error => {
        console.log('Error connecting to database', error)
      })

    /************************************************************************************
                                  Set basic express settings
    ***********************************************************************************/
    const app = express()
    app.use(cors())
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ limit: '10mb', extended: true }))

    app.use('/api', BaseRouter)
    app.use('/templates', express.static('public/templates'))
    console.log('Static files served from:', path.join(__dirname, '/public'))

    return app
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`)
  }
}
export default initApp
