import { Request, Response } from "express";
import {
  generateResume,
  generateSection,
  translateResume,
} from "../services/GroqAI.service";

const generateResumeFromScratch = async (req: Request, res: Response) => {
  try {
    const { bio, experiences, educations } = req.body;
    const CVUploadResponse = await generateResume({
      bio,
      experiences,
      educations,
    });
    res.status(200).json(CVUploadResponse);
  } catch (err) {
    console.error("Error generating resume:", err);
    res.status(500).send("Error generating resume.");
  }
};

const regenerateSectionOnResume = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const sectionResponse = await generateSection(data);
    res.status(200).json(sectionResponse);
  } catch (err) {
    console.error("Error generating section:", err);
    res.status(500).send("Error generating section.");
  }
};

const translateGeneratedResume = async (req: Request, res: Response) => {
  try {
    const { language, resumeId } = req.params;
    const {
      fullName,
      jobTitle,
      bio,
      experiences,
      educations,
      skills,
      languages,
    } = req.body;

    if (!language) {
      return res
        .status(400)
        .send("Resume text and target language are required.");
    }

    const [
      translatedName,
      translateJobTitle,
      translatedBio,
      translatedEducations,
      translatedExperiences,
      translatedSkills,
      translateLanguages
    ] = await translateResume({
      fullName,
      jobTitle,
      bio,
      experiences,
      educations,
      skills,
      languages,
      language
    });

    res.status(200).json({
      name: translatedName,
      jobTitle: translateJobTitle,
      bio: translatedBio,
      educations: translatedEducations,
      experiences: translatedExperiences,
      skills: translatedSkills,
      languages: translateLanguages
    });
  } catch (err) {
    res.status(500).send("Error translating resume.");
  }
};

export default {
  generateResumeFromScratch,
  regenerateSectionOnResume,
  translateGeneratedResume,
};
