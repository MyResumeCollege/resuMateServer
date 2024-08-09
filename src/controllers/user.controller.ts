import UserModel from "../models/userModel";
import { Request, Response } from "express";
import {Resume} from "../types/resume.type"

async function checkIfPremium(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const query = id ? { _id: id } : {};

    const model = await UserModel.find(query).select(["isPremium"]);

    if (model.length === 0) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.send(model[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function setPremium(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const { isPremium } = req.body;

    if (typeof isPremium !== "boolean") {
      return res.status(400).json({ message: "Invalid isPremium value" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isPremium },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getResumePreviews = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).populate<{ resumes: Resume[] }>("resumes");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resumePreviews = (user.resumes as Resume[]).map((resume) => ({
      resumeId: resume._id,
      creationDate: resume.createdAt,
      jobTitle: resume.jobTitle,
      fullName: resume.fullName,
    }));

    res.status(200).json(resumePreviews);
  } catch (error) {
    res.status(500).json({ message: "Error getting resume previews", error });
  }
};

export default {
  checkIfPremium,
  setPremium,
  getResumePreviews,
};
