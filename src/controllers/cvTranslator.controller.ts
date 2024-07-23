import { Request, Response } from 'express'
import { translateResume } from '../services/GroqAI.service'
import PDFParser from 'pdf-parse'

const translateGeneratedResume = async (req: Request, res: Response) => {
  try {
    const language = Array.isArray(req.headers['language'])
      ? req.headers['language'][0]
      : req.headers['language'] || ''
    if (!req.file || !language) {
      return res
        .status(400)
        .send('Resume text and target language are required.')
    }
    console.log(language)

    const { buffer } = req.file
    const data = await PDFParser(buffer)
    console.log(data.text)
    const translatedCV = await translateResume({
      detailedCV: data.text,
      resumeLanguage: language,
    })
    console.log(translatedCV)

    res.status(200).json({ translatedCV })
  } catch (err) {
    console.error('Error translating resume:', err)
    res.status(500).send('Error translating resume.')
  }
}

export default {
  translateGeneratedResume,
}
