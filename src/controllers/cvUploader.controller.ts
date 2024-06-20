import { Request, Response } from "express";
import PDFParser from "pdf-parse";

const convertPdfToText = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const { buffer } = req.file;
      const data = await PDFParser(buffer);
      const text = data.text;

        // TODO - implement service 
        // const processedText = await processText(data.text);
  
        res.json({ data });
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Error uploading file.');
    }
  };
  
  export default {
    convertPdfToText
  };