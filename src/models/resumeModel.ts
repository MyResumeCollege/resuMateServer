import mongoose from 'mongoose'
import { Resume } from '../types/resume.type'

const resumeSchema = new mongoose.Schema<Resume>({
  ownerName: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  content: { type: String, required: true },
})

export default mongoose.model<Resume>('Resume', resumeSchema)
