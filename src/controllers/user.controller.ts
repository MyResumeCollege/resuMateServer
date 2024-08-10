import UserModel from "../models/userModel";
import { Request, Response } from "express";
import {Resume} from "../types/resume.type"
import resumeModel from "../models/resumeModel";
import axios from "axios";
import { LANGUAGE_LEVEL_NAME } from "../types/language-knowledge.type";
import { SKILL_LEVEL_NAME } from "../types/skill.type";

type SetUrlForPreviewResponse = {
  url: string;
};

async function checkIfPremium(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const query = id ? { _id: id } : {};

    const model = await UserModel.find(query).select(["isPremium"]);

    if (model.length === 0) {
      return res.status(404).json({ message: "Model not found" });
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

    if (typeof isPremium !== "boolean") {
      return res.status(400).json({ message: "Invalid isPremium value" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isPremium },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getResumePreviews = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).populate<{ resumes: Resume[] }>("resumes");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resumePreviews = (user.resumes as Resume[]).map((resume) => ({
      id: resume._id,
      creationDate: resume.createdAt,
      jobTitle: resume.jobTitle
    }));

    res.status(200).json(resumePreviews);
  } catch (error) {
    res.status(500).json({ message: "Error getting resume previews", error });
  }
};

const getResumeUrl = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId)
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resumeId = req.params.id;
    
    const resume = await resumeModel.findById(resumeId) as Resume
    if (!resume) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }

    const response = await axios.post<SetUrlForPreviewResponse>(
      "http://localhost:3000/api/preview/generate-preview-url",
      {
      resumeId: resume._id,
      fullName: resume.fullName,
      jobTitle: resume.jobTitle,
      bio: resume.bio,
      skills: resume.skills.map(skill => `${skill.name} - ${SKILL_LEVEL_NAME[skill.level]}`).join('\n'),
      experiences: resume.experiences,
      educations: resume.educations,
      languages: resume.languages
      .map(language => 
        `${language.lang} - ${LANGUAGE_LEVEL_NAME[language.level]}`
      ).join('\n'),
    });

    const url = response.data.url;
    const urlParts = url.split('/');
    const id = urlParts[urlParts.length - 2];

    res.json(id);
  } catch (error) {
    res.status(500).json({ message: "Error getting resume previews", error });
  }
};

export default {
  checkIfPremium,
  setPremium,
  getResumePreviews,
  getResumeUrl
};
