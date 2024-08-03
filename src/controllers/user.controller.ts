import mongoose from "mongoose";
import UserModel from "../models/userModel";
import { Request, Response } from "express";

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
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
};

const getUserResumeIds = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).populate("resumes");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resumeIds = (
      user.resumes as unknown as mongoose.Types.ObjectId[]
    ).map((resume) => (resume as mongoose.Types.ObjectId)._id);

    res.status(200).json(resumeIds);
  } catch (error) {
    res.status(500).json({ message: "Error getting resume IDs", error });
  }
};

export default {
  checkIfPremium,
  setPremium,
  getAllUsers,
  getUserResumeIds,
};
