import { Request, Response } from 'express';
import { translateResume } from '../services/GroqAI.service';

const translateGeneratedResume = async (req: Request, res: Response) => {
  try {
    const { description, skills, experiences, resumeLanguage } = req.body;

    if (!resumeLanguage) {
      return res
        .status(400)
        .send('Resume text and target language are required.');
    }

    const translatedCV = await translateResume({
      description,
      skills,
      experiences,
      resumeLanguage,
    });

    res.status(200).json({ translatedCV });
  } catch (err) {
    console.error('Error translating resume:', err);
    res.status(500).send('Error translating resume.');
  }
};

export default {
  translateGeneratedResume,
};

