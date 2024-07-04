import mongoose from 'mongoose'

export type Resume = {
  _id?: mongoose.Schema.Types.ObjectId
  ownerName: string
  createdAt: Date
  content: string
}
