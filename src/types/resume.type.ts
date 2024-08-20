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

export type ExperiencePeriodTime = {
  month: string;
  year: string;
}

export type ExperiencePeriod = {
  id: string;
  jobTitle: string;
  employer: string;
  city: string;
  startDate: ExperiencePeriodTime;
  endDate: ExperiencePeriodTime;
  isCurrent: boolean;
  description: string;
}

export type EducationPeriodTime = {
  month: string;
  year: string;
}

export type EducationPeriod = {
  id: string;
  degree: string;
  school: string;
  startDate: EducationPeriodTime;
  endDate: EducationPeriodTime;
  isCurrent: boolean;
  description: string;
}

export interface Resume extends mongoose.Document {
  resumePreviewId: string;
  createdAt: Date;
  fullName?: string;
  jobTitle?: string;
  bio?: string;
  skills: string;
  experiences?: string;
  educations?: string;
  languages: string;
  template: number;
}