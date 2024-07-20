import { Request, Response } from "express";
import puppeteer from "puppeteer";

export const generatePdf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, jobTitle } = req.body;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = `http://localhost:5173/preview?fullName=${encodeURIComponent(fullName)}&jobTitle=${encodeURIComponent(jobTitle)}`;

    await page.goto(url,{
        waitUntil: "networkidle2",
      }
    );

    const pdfBuffer = await page.pdf({ format: "a4" });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');    
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};
