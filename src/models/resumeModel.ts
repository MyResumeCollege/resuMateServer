import mongoose from 'mongoose'
import { Resume } from '../types/resume.type'

const educationPeriodSchema = new mongoose.Schema({
  degree: { type: String },
  school: { type: String },
  startDate: { type: {month: String, year: String} },
  endDate: { type: {month: String, year: String} },
  isCurrent: { type: Boolean },
  description: { type: String }
})

const experiencePeriodSchema = new mongoose.Schema({
  jobTitle: { type: String },
  employer: { type: String },
  city: { type: String },
  startDate: { type: {month: String, year: String} },
  endDate: { type: {month: String, year: String} },
  isCurrent: { type: Boolean },
  description: { type: String }
})

const resumeSchema = new mongoose.Schema<Resume>({
  resumePreviewId: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  fullName: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  jobTitle: { type: String },
  bio: { type: String },
  skills: { type: String },
  experiences: [experiencePeriodSchema],
  educations: [educationPeriodSchema],
  languages: { type: String },
  template: { type: Number },
  resumeLanguage: { type: String }
});

const ResumeModel = mongoose.model<Document & Resume>('Resume', resumeSchema);

export default ResumeModel;