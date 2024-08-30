import UserModel from '../models/userModel';
import { Request, Response } from 'express';
import { Resume } from '../types/resume.type';
import resumeModel from '../models/resumeModel';
import ResumeModel from '../models/resumeModel';
import mongoose from 'mongoose';
import PreviewModel from '../models/previewModel';
import { EducationPeriod, ExperiencePeriod } from '../types/resumeData.type';

type CreateResumeRequestBody = {
  resumePreviewId?: string;
  fullName: string;
  phoneNumber?: string;
  email?: string;
  jobTitle: string;
  bio: string;
  skills: string;
  experiences?: ExperiencePeriod[];
  educations?: EducationPeriod[];
  languages: string;
  template: number;
  resumeLanguage: string;
};

async function checkIfPremium(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const query = id ? { _id: id } : {};

    const model = await UserModel.find(query).select(['isPremium']);

    if (model.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }

    res.send(model[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function setPremium(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { isPremium } = req.body;

    if (typeof isPremium !== 'boolean') {
      return res.status(400).json({ message: 'Invalid isPremium value' });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isPremium },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getResumePreviews = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).populate<{
      resumes: Resume[];
    }>('resumes');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const resumePreviews = (user.resumes as Resume[]).map((resume) => ({
      id: resume._id,
      creationDate: resume.createdAt,
      jobTitle: resume.jobTitle,
    }));

    res.status(200).json(resumePreviews);
  } catch (error) {
    res.status(500).json({ message: 'Error getting resume previews', error });
  }
};

const getResumeUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const resumeId = req.params.id;
    const resume = (await resumeModel.findById(resumeId)) as Resume;    
    if (!resume) {
      res.status(404).json({ message: 'Resume not found' });
      return;
    }
    res.send(resume.resumePreviewId);
  } catch (error) {
    res.status(500).json({ message: 'Error getting resume previews', error });
  }
};

const upsertCv = async (
  req: Request<{ userId: string }, {}, CreateResumeRequestBody>,
  res: Response
) => {
  try {
    const {
      resumePreviewId,
      fullName,
      phoneNumber,
      email,
      jobTitle,
      bio,
      skills,
      experiences,
      educations,
      languages,
      template,
      resumeLanguage,
    } = req.body;    

    const userId = req.params.userId;

    let savedResume = await ResumeModel.findOne({ resumePreviewId });
    
    if (savedResume != undefined) {
      savedResume.fullName = fullName;
      savedResume.phoneNumber = phoneNumber;
      savedResume.email = email;
      savedResume.jobTitle = jobTitle;
      savedResume.bio = bio;
      savedResume.experiences = experiences;
      savedResume.educations = educations;
      savedResume.skills = skills;
      savedResume.languages = languages;
      savedResume.resumeLanguage = resumeLanguage;

      await PreviewModel.updateOne(
        { id: resumePreviewId },
        {
          $set: {
            resumeData: {
              fullName,
              phoneNumber,
              email,
              jobTitle,
              bio,
              experiences,
              educations,
              skills,
              languages,
              template,
              resumeLanguage,
            },
          },
        }
      );
    } else {
      savedResume = new ResumeModel({
        resumePreviewId,
        fullName,
        jobTitle,
        bio,
        skills,
        experiences,
        educations,
        languages,
        template,
        resumeLanguage,
      });      

      const user = await UserModel.findById({ _id: userId });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      user.resumes.push(savedResume._id as mongoose.Schema.Types.ObjectId);
      await user.save();
    }

    await savedResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ message: 'Error saving resume', error });
  }
};

const deleteCv = async (req: Request, res: Response) => {
  try {
    // resumeId is resumePreviewId
    const { resumeId, userId } = req.params;

    const resume = await ResumeModel.findOne({ resumePreviewId: resumeId });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await ResumeModel.deleteOne({ resumePreviewId: resumeId });

    const userResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { resumes: resume._id } }
    );

    if (userResult.modifiedCount === 0) {
      return res.status(404).json({
        message: "User not found or resumeId not in user's resumes array",
      });
    }

    await PreviewModel.deleteOne({ id: resumeId });

    res
      .status(200)
      .json({ message: 'Resume deleted successfully', resumeId: resume._id });
  } catch (error) {
    res.status(500).json({ message: 'Error delete resume', error });
  }
};

export default {
  checkIfPremium,
  setPremium,
  getResumePreviews,
  getResumeUrl,
  upsertCv,
  deleteCv,
};
