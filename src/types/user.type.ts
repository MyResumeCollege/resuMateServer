import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  resumes: mongoose.Schema.Types.ObjectId[];
  name: string;
  email: string;
  password: string;
  image?: string;
  isPremium: boolean;
  refreshTokens?: string[];
}
