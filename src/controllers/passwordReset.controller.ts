import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

// console.log('EMAIL_USER:', process.env.EMAIL_USER);
// console.log('EMAIL_PASS is set:', !!process.env.EMAIL_PASS);
// console.log(
//   'EMAIL_PASS length:',
//   process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
// );

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
transporter.verify(function (error, success) {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Generate a password reset token
const generateResetToken = async (req: Request, res: Response) => {
  console.log('Received forgot password request');
  console.log('Request body:', req.body);
  const { email } = req.body;

  if (!email) {
    console.log('No email provided in request');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    console.log('Searching for user with email:', email);
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found, generating reset token');
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    console.log('Reset token saved to user document');

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    // console.log('Attempting to send email');
    // console.log('Email options:', JSON.stringify(mailOptions, null, 2));
    try {
      const info = await transporter.sendMail(mailOptions);
      // console.log('Email sent successfully');
      // console.log('Message ID:', info.messageId);
      // console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw emailError; // Re-throw to be caught by outer try-catch
    }

    res.status(200).json({ message: 'Reset token generated and email sent' });
  } catch (error) {
    console.error('Error in generateResetToken:', error);
    res
      .status(500)
      .json({ message: 'Error generating reset token', error: error.message });
  }
};

// Verify the reset token
const verifyResetToken = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying reset token', error });
  }
};

// Reset the password
const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired' });
    }

    // Encrypt the new password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Set the new encrypted password
    user.password = encryptedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

export default {
  generateResetToken,
  verifyResetToken,
  resetPassword,
};
