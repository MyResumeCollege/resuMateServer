import mongoose from 'mongoose'

export type ResumteTemplate = {
  _id?: mongoose.Types.ObjectId
  isPremium: boolean
  imageUrl: string
}
