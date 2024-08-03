import mongoose from 'mongoose'
import { languagesType, Resume, skillsType } from '../types/resume.type'

const skillsSchema = new mongoose.Schema<skillsType>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
})

const languagesSchema = new mongoose.Schema<languagesType>({
  id: { type: String, required: true },
  lang: { type: String, required: true },
  level: { type: Number, required: true },
})

const resumeSchema = new mongoose.Schema<Resume>({
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  fullName: { type: String },
  jobTitle: { type: String },
  bio: { type: String },
  skills: { type: [skillsSchema], default: [] },
  experiences: { type: [String] },
  educations: { type: [String] },
  languages: { type: [languagesSchema], default: [] },
})

export default mongoose.model<Resume>('Resume', resumeSchema)
