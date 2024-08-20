import mongoose from 'mongoose'
import { Resume } from '../types/resume.type'

const resumeSchema = new mongoose.Schema<Resume>({
  resumePreviewId: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  fullName: { type: String },
  jobTitle: { type: String },
  bio: { type: String },
  skills: { type: String },
  experiences: { type: String },
  educations: { type: String },
  languages: { type: String },
  template: { type: Number }
});

const ResumeModel = mongoose.model<Document & Resume>('Resume', resumeSchema);

export default ResumeModel;