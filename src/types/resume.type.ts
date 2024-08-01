import mongoose from 'mongoose'

export type Resume = {
  _id: mongoose.Schema.Types.ObjectId
  ownerId: mongoose.Schema.Types.ObjectId
  createdAt: Date
  fullName: string
  jobTitle: string
  bio: string
  skills: string[]
  experiences: []
  educations: []
  languages: []
}
