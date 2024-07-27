import { Request, Response } from 'express';
import { generateResume } from '../services/GroqAI.service';

const generateResumeFromScratch = async (req: Request, res: Response) => {
  try {    
    const { description, skills, experiences, educations, languages } = req.body
    const CVUploadResponse = await generateResume({
      description,
      skills,
      experiences,
      educations,
      languages
    })
    res.status(200).json(CVUploadResponse)
  } catch (err) {
    console.error('Error generating resume:', err);
    res.status(500).send('Error generating resume.');
  }
};

export default {
  generateResumeFromScratch,
};
