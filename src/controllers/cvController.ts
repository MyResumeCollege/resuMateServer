import { Request, Response } from "express";
import { downloadResume } from "../services/downloadResume.service";
import { ResumeResponse } from "../types/resumeData.type";
import { v4 as uuidv4 } from "uuid";
import PreviewModel from "../models/previewModel";

const downloadCV = async (req: Request, res: Response): Promise<void> => {
  try {
    await downloadResume(req, res);
  } catch (err) {
    res.status(500).send("Error generating PDF");
  }
};

const updatePreviewModelAndSetUrlForPreview = async (req: Request, res: Response) => {
  const resumeResponse: ResumeResponse = req.body;
  const id = req.params.id || uuidv4();
  
  const preview = new PreviewModel({ id, resumeData: resumeResponse });
  await preview.save();
  res.status(200).json({ url: `${process.env.FRONTEND_URL}/preview/${id}/clear` });
};

const getPreviewCV = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await PreviewModel.findOne({ id });

  if (data) res.json(data.resumeData);  
  else res.status(404).json({ error: "Data not found" });
};

export default {
  downloadCV,
  updatePreviewModelAndSetUrlForPreview,
  getPreviewCV
};
