import path from "path";
import Template from "../models/resumeTemplate";
import { Request, Response } from "express";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const IMAGE_FOLDER = "/templates";

app.use(express.static(path.join(__dirname, "public")));

const getTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await Template.find();

    const templatesWithUrls = templates.map((template) => ({
      ...template.toObject(),
      imageUrl: `${BASE_URL}${IMAGE_FOLDER}/${path.basename(
        template.imageUrl
      )}`,
    }));
    res.status(200).json(templatesWithUrls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching templates", error });
  }
};

const addTemplate = async (req: Request, res: Response) => {
  const { imageUrl, isPremium } = req.body;
  const imageName = path.basename(imageUrl);
  const serverImageUrl = `${BASE_URL}${IMAGE_FOLDER}/${imageName}`;

  const newTemplate = new Template({ imageUrl: serverImageUrl, isPremium });

  try {
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(500).json({ message: "Error adding template", error });
  }
};

export default { getTemplates, addTemplate };
