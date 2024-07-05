import mongoose from 'mongoose'

export type User = {
  _id?: mongoose.Schema.Types.ObjectId
  name: string
  email: string
  password: string
  image?: string
  isPremium: boolean
  refreshTokens?: string[]
}