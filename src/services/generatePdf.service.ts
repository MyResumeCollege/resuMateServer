import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import axios from "axios";
import {ResumeResponse} from "../types/resumeData.type"

export const generatePdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const resumeResponse: ResumeResponse = req.body;
    const previewResponse = await axios.post('http://localhost:3000/api/preview/generate-preview-url', {
      body: JSON.stringify(resumeResponse),
    });
    const { url } = await previewResponse.data;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const pdfBuffer = await page.pdf({ format: 'a4' });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};
