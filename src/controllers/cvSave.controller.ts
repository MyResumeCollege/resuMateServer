import { Request, Response } from 'express'
import UserModel from '../models/userModel'
import { Skill } from '../types/skill.type';
import { LanguageKnowledge } from '../types/language-knowledge.type';
import { Types } from 'mongoose';
import ResumeModel from '../models/resumeModel';
import mongoose from 'mongoose'

interface CreateResumeRequestBody {
  ownerId: Types.ObjectId;
  fullName?: string;
  jobTitle?: string;
  bio?: string;
  skills: Skill[];
  experiences?: string;
  educations?: string;
  languages: LanguageKnowledge[];
}

const saveCv = async (req: Request<{}, {}, CreateResumeRequestBody>, res: Response) => {
  try {
    const {
      ownerId,
      fullName,
      jobTitle,
      bio,
      skills,
      experiences,
      educations,
      languages,
    } = req.body
    const savedResume = new ResumeModel({
      ownerId,
      fullName,
      jobTitle,
      bio,
      skills,
      experiences,
      educations,
      languages,
    })
    await savedResume.save()
    
    const user = await UserModel.findById(ownerId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const resumeId = savedResume._id as mongoose.Schema.Types.ObjectId;
    user.resumes.push(resumeId);
    await user.save()
    res.status(201).json(savedResume)
  } catch (error) {
    res.status(500).json({ message: 'Error saving resume', error })
  }
}

export default {
  saveCv
}
