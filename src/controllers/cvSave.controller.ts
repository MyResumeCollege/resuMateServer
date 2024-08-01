import { Request, Response } from 'express'
import ResumeModel from '../models/resumeModel'
import UserModel from '../models/userModel'

const saveCv = async (req: Request, res: Response) => {
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
    const newResume = new ResumeModel({
      ownerId,
      fullName,
      jobTitle,
      bio,
      skills,
      experiences,
      educations,
      languages,
    })
    await newResume.save()
    const user = await UserModel.findById(ownerId)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    user.resumes.push(newResume._id)
    await user.save()
    res.status(201).json(newResume)
  } catch (error) {
    res.status(500).json({ message: 'Error saving resume', error })
  }
}
const getAllResumes = async (req: Request, res: Response) => {
  try {
    const resumes = await ResumeModel.find()
    res.status(200).json(resumes)
  } catch (error) {
    res.status(500).json({ message: 'Error getting resumes', error })
  }
}

export default {
  saveCv,
  getAllResumes,
}
