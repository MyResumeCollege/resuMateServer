import mongoose from 'mongoose'
import { IUser } from '../types/user.type'

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    isEmail: true,
  },
  password: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  isPremium: {
    type: Boolean,
    required: true,
    default: false,
  },
  refreshTokens: [
    {
      type: [String],
    },
  ],
  resumes: { type: [mongoose.Schema.Types.ObjectId], ref: 'Resume' },
})

const UserModel = mongoose.model<IUser>('User', userSchema)

export default UserModel
