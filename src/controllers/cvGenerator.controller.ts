import { Request, Response } from 'express';
import { generateResume } from '../services/GroqAI.service';

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
    console.error('Error generating resume:', err);
    res.status(500).send('Error generating resume.');
  }
};

const generateSection = async (req: Request, res: Response) => {
  try {    
    const { section } = req.body
    const CVUploadResponse = await generateResume(section)
    res.status(200).json(CVUploadResponse)
  } catch (err) {
    console.error('Error generating section:', err);
    res.status(500).send('Error generating section.');
  }
};

export default {
  generateResumeFromScratch,
  generateSection
};
