import mongoose from 'mongoose'
import { Resume } from '../types/resume.type'

const resumeSchema = new mongoose.Schema<Resume>({
  ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  fullName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  bio: { type: String, required: true },
  skills: { type: [String], required: true },
  experiences: { type: [String], required: true },
  educations: { type: [String], required: true },
  languages: { type: [String], required: true },
})

export default mongoose.model<Resume>('Resume', resumeSchema)
