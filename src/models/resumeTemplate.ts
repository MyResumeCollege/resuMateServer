import mongoose from 'mongoose'
import { ResumteTemplate } from '../types/resumeTemplate.type'

const resumeTemplateSchema = new mongoose.Schema<ResumteTemplate>({
  imageUrl: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
})
export default mongoose.model<ResumteTemplate>('Template', resumeTemplateSchema)
