import path from "path";
import Template from "../models/resumeTemplate";
import { Request, Response } from "express";
import express from "express";

const app = express();

<<<<<<< Updated upstream
const BASE_URL = "http://localhost:3000";
const IMAGE_FOLDER = "/templates";
=======
const BASE_URL = 'http://localhost:' + process.env.PORT
const IMAGE_FOLDER = '/templates'
>>>>>>> Stashed changes

app.use(express.static(path.join(__dirname, "public")));

const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find();

<<<<<<< Updated upstream
    const templatesWithUrls = templates.map((template) => ({
      ...template.toObject(),
      imageUrl: `${BASE_URL}${IMAGE_FOLDER}/${path.basename(
        template.imageUrl
      )}`,
    }));
=======
    const templatesWithUrls = templates.map(template => ({
      ...template.toObject(),
      imageUrl: `${BASE_URL}${IMAGE_FOLDER}/${path.basename(
        template.imageUrl
      )}`
    }))
>>>>>>> Stashed changes

    res.status(200).json(templatesWithUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching templates", error });
  }
};

const addTemplate = async (req: Request, res: Response) => {
  const { imageUrl, isPremium } = req.body;
  const newTemplate = new Template({ imageUrl, isPremium });
  try {
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: "Error adding template", error });
  }
};

export default { getTemplates, addTemplate };
