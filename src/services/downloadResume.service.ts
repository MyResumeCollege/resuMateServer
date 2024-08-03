import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

export const downloadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const {url} = req.body;    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
        
    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    await page.evaluate(() => {
      const elementsToRemove = [
        document.getElementById('translate'),
        document.getElementById('generate-section')
      ];
  
      elementsToRemove.forEach(element => {
        if (element) element.remove();
      });
    });
  

    const pdfBuffer = await page.pdf({ format: 'a4', printBackground: true });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
};
