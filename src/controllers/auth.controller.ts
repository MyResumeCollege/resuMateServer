import { Request, Response } from "express";
import User from "../models/userModel";
import { IUser } from "../types/user.type";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client();

const logInGoogle = async (req: Request, res: Response) => {
  const { credentialResponse } = req.body;
  const credential = credentialResponse.credential;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { name, email, picture } = payload;
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    if (picture) user.image = payload.picture;

    const tokens = await generateTokens(user);
    return res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

const generateTokens = async (user: IUser) => {
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET
    );
  
    if (user.refreshTokens == null) user.refreshTokens = [refreshToken];
    else user.refreshTokens.push(refreshToken);
  
    await user.save()
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  };

export default {
  logInGoogle
};
