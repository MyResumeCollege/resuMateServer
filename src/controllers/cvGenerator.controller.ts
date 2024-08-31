import { Request, Response } from "express";
import {
  generateResume,
  generateSection
} from "../services/GroqAI.service";

const generateResumeFromScratch = async (req: Request, res: Response) => {
  try {    
    const { bio, experiences, educations } = req.body
    const CVUploadResponse = await generateResume({
      bio,
      experiences,
      educations
    })
    res.status(200).json(CVUploadResponse)
  } catch (err) {
    res.status(500).send('Error generating resume.');
  }
};

const regenerateSectionOnResume = async (req: Request, res: Response) => {
  try {
    const { data } = req.body
    const sectionResponse = await generateSection(data)
    res.status(200).json(sectionResponse)
  } catch (err) {
    res.status(500).send("Error generating section.");
  }
};

export default {
  generateResumeFromScratch,
  regenerateSectionOnResume
};
