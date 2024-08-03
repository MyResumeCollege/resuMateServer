import mongoose from 'mongoose'

export type languagesType = {
  id: string
  lang: string
  level: number
}

export type skillsType = {
  id: string
  name: string
  level: number
}

export type Resume = {
  _id: mongoose.Schema.Types.ObjectId
  ownerId: mongoose.Schema.Types.ObjectId
  createdAt: Date
  fullName: string
  jobTitle: string
  bio: string
  skills: skillsType[]
  experiences: []
  educations: []
  languages: languagesType[]
}
