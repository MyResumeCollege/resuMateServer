import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import {
  createUserObject,
  registerUser,
  generateResetToken,
  verifyResetToken,
  resetPassword,
} from '../helpers/testHelpers';
import UserModel from '../models/userModel';

let app: Express;
let resetToken: string;

beforeAll(async () => {
  app = await initApp();
  await UserModel.deleteMany();

  // Register a user for password reset tests
  const newUser = createUserObject(
    'Reset Test User',
    'reset@example.com',
    'password123'
  );
  await registerUser(app, newUser);
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Password Reset Operations', () => {
  it('should generate a reset token', async () => {
    const response = await generateResetToken(app, 'reset@example.com');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reset token generated and email sent');
  });

  it('should verify a valid reset token', async () => {
    const user = await UserModel.findOne({ email: 'reset@example.com' });
    resetToken = user.resetPasswordToken;

    const response = await verifyResetToken(app, resetToken);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Token is valid');
  });

  it('should reset the password with a valid token', async () => {
    const response = await resetPassword(app, resetToken, 'newpassword123');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password has been reset');
  });

  it('should not reset the password with an invalid token', async () => {
    const invalidToken = 'invalidtoken123';
    const response = await resetPassword(app, invalidToken, 'newpassword123');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password reset token is invalid or has expired'
    );
  });
});
