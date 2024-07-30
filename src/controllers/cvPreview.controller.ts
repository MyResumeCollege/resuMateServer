import { Request, Response } from "express";
import { generatePdf } from "../services/generatePdf.service";
import { v4 as uuidv4 } from 'uuid';
import { ResumeResponse } from '../types/resumeData.type'

const previewData = new Map<string, ResumeResponse>();

const generateCV = async (req: Request, res: Response): Promise<void> => {
  try {
    await generatePdf(req, res);
  } catch (err) {
    res.status(500).send("Error generating PDF");
  }
};

const setUrlForPreview = async (req: Request, res: Response) => {
    const resumeResponse: ResumeResponse = req.body;
    const uniqueId = uuidv4();
    previewData.set(uniqueId, resumeResponse);

    res.json({ url: `http://localhost:5173/preview/${uniqueId}/clear` });
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
