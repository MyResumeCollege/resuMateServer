import mongoose from 'mongoose'
import { User } from '../types/user.type'

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  isPremium: { type: Boolean, required: true, default: false },
  refreshTokens: [{ type: String }],
})

export default mongoose.model<User>('User', userSchema)
