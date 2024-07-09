import { Request, Response } from 'express'
import User from '../models/userModel'
import { IUser } from '../types/user.type'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const client = new OAuth2Client()

const logInGoogle = async (req: Request, res: Response) => {
  const { credentialResponse } = req.body
  const credential = credentialResponse.credential

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()

    const { name, email, picture } = payload
    let user = await User.findOne({ email: email })
    if (!user) {
      user = await User.create({
        name,
        email,
      })
    }

    if (picture) user.image = payload.picture

    const tokens = await generateTokens(user)
    return res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(400).send(err)
  }
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send('email or password is null')
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).send('user is not exists')
    }
    // Check if the password correspond to the hashed password.
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw res.status(400).send('invalid password')
    }
    const { accessToken, refreshToken } = await generateTokens(user)
    return res.status(200).send({
      accessToken,
      refreshToken,
      user,
    })
  } catch (err) {
    return res.status(400).send(err.message)
  }
}

const registerUser = async (req: Request, res: Response) => {
  const { email, password, name, image } = req.body

  if (!email || !password || !name) {
    return res.status(400).send('missing email or password or name')
  }

  try {
    const existAccount = await User.findOne({ email })
    if (existAccount) {
      throw res.status(400).send('user already exist')
    }
    const encryptedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      email,
      password: encryptedPassword,
      name,
      image,
    })
    const { accessToken, refreshToken } = await generateTokens(newUser)

    return res.status(201).send({ user: newUser, accessToken, refreshToken })
  } catch (err) {
    return res.status(400).send(err.message)
  }
}

const logoutUser = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization']
  const refreshToken = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!refreshToken) return res.sendStatus(401)

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        return res.sendStatus(401).send(err.message)
      }
      try {
        const userDb = await User.findOne({ _id: user._id })
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = []
          await userDb.save()
          return res.sendStatus(401)
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            t => t !== refreshToken
          )
          await userDb.save()
          return res.status(200).send('User has been logged out')
        }
      } catch (err) {
        res.send(err.message)
      }
    }
  )
}

const generateTokens = async (user: IUser) => {
  const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  })
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET
  )

  if (user.refreshTokens == null) user.refreshTokens = [refreshToken]
  else user.refreshTokens.push(refreshToken)

  await user.save()
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  }
}

export default {
  logInGoogle,
  loginUser,
  registerUser,
  logoutUser,
}
