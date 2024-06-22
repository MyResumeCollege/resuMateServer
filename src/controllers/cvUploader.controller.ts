import { Request, Response } from "express";
import PDFParser from "pdf-parse";
import { generateResume } from "../services/GroqAI.service";

const generateResumeFromExistCV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { buffer } = req.file;
    const data = await PDFParser(buffer);

    const CVUploadResponse = await generateResume({ detailedCV: data.text });

    res.json({ CVTextContent: CVUploadResponse });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Error uploading file.");
  }
};

export default {
  generateResumeFromExistCV,
};
