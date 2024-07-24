import { Request, Response } from "express";
import { generatePdf } from "../services/generatePdf.service";
import { v4 as uuidv4 } from 'uuid';
import { ResumeSections } from '../types/resumeData.type'

const previewData = new Map<string, ResumeSections>();

const generateCV = async (req: Request, res: Response): Promise<void> => {
  try {
    await generatePdf(req, res);
  } catch (err) {
    console.error("Error in previewResume:", err);
    res.status(500).send("Error generating PDF");
  }
};

const setUrlForPreview = async (req: Request, res: Response) => {
    const resumeSections: ResumeSections = req.body;
    const uniqueId = uuidv4();
    previewData.set(uniqueId, resumeSections);

    res.json({ url: `http://localhost:5173/preview/${uniqueId}` });
};

const getPreviewCV = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = previewData.get(id);
    
    if (data) res.json(data);
    else res.status(404).json({ error: 'Data not found' });
}

export default {
  generateCV,
  setUrlForPreview,
  getPreviewCV
};
