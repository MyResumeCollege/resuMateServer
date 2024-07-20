import { Request, Response } from 'express';
import { generatePdf } from '../services/generatePdf.service';

const previewResume = async (req: Request, res: Response): Promise<void> => {
    try {
      await generatePdf(req, res);
    } catch (err) {
      console.error('Error in previewResume:', err);
      res.status(500).send('Error generating PDF');
    }
  };

export default {
    previewResume
}