import mongoose from "mongoose";
import { User } from "../types/user.type";

const userSchema = new mongoose.Schema<User>({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true 
   },
  password: { 
    type: String,
    required: true 
  },
  image: { 
    type: String,
    required: false 
  },
  isPremium: { 
    type: Boolean,
    required: true,
    default: false 
  },
  refreshTokens: [{ 
    type: [String],
  }],
});

export default mongoose.model<User>("User", userSchema);
