import mongoose from 'mongoose'

export type User = {
  _id?: mongoose.Schema.Types.ObjectId
  email: string
  password: string
  name: string
  image?: string
  isPremium: boolean
  refreshTokens?: string[]
}
