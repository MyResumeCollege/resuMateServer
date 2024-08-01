import Template from '../models/resumeTemplate'
import { Request, Response } from 'express'

const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find()
    res.status(200).json(templates)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error })
  }
}

const addTemplate = async (req: Request, res: Response) => {
  const { imageUrl, isPremium } = req.body
  const newTemplate = new Template({ imageUrl, isPremium })
  try {
    await newTemplate.save()
    res.status(201).json(newTemplate)
  } catch (error) {
    res.status(500).json({ message: 'Error adding template', error })
  }
}

export default { getTemplates, addTemplate }
