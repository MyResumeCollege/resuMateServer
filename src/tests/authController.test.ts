import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import initApp from '../app';
import {
  createUserObject,
  registerUser,
  loginAccount,
  logoutUser,
  setPremium,
} from '../helpers/testHelpers';
import UserModel from '../models/userModel';

jest.mock('google-auth-library');

let app: Express;

beforeAll(async () => {
  app = await initApp();
}, 10000);

beforeEach(async () => {
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Authentication and Premium Features', () => {
  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      const newUser = createUserObject(
        'John Doe',
        'john@example.com',
        'password123'
      );
      const response = await registerUser(app, newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUser.email);
    });

    it('should not register a user with an existing email', async () => {
      const existingUser = createUserObject(
        'Jane Doe',
        'john@example.com',
        'password456'
      );
      await registerUser(app, existingUser);
      const response = await registerUser(app, existingUser);

      expect(response.status).toBe(400);
      expect(response.text).toContain('user already exist');
    });

    it('should return 400 when registering without required fields', async () => {
      const incompleteUser = createUserObject('', 'incomplete@example.com', '');
      const response = await registerUser(app, incompleteUser);

      expect(response.status).toBe(400);
      expect(response.text).toBe('missing email or password or name');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      const user = createUserObject(
        'John Doe',
        'john@example.com',
        'password123'
      );
      await registerUser(app, user);
    });

    it('should successfully login a registered user', async () => {
      const response = await loginAccount(
        app,
        'john@example.com',
        'password123'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should not login with incorrect credentials', async () => {
      const response = await loginAccount(
        app,
        'john@example.com',
        'wrongpassword'
      );

      expect(response.status).toBe(400);
      expect(response.text).toContain('invalid password');
    });

    it('should not login with non-existent user', async () => {
      const response = await loginAccount(
        app,
        'nonexistent@example.com',
        'password123'
      );

      expect(response.status).toBe(400);
      expect(response.text).toBe('user is not exists');
    });
  });

  describe('User Logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const user = createUserObject(
        'John Doe',
        'john@example.com',
        'password123'
      );
      await registerUser(app, user);
      const loginResponse = await loginAccount(
        app,
        'john@example.com',
        'password123'
      );
      refreshToken = loginResponse.body.refreshToken;
    });

    it('should successfully logout a user', async () => {
      const logoutResponse = await logoutUser(app, refreshToken);

      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.text).toBe('User has been logged out');
    });

    it('should return 401 when logging out with a token not in refreshTokens list', async () => {
      const user = await UserModel.findOne({ email: 'john@example.com' });
      user.refreshTokens = [];
      await user.save();

      const logoutResponse = await logoutUser(app, refreshToken);

      expect(logoutResponse.status).toBe(401);
    });
  });

  describe('Google Login', () => {
    it('should login an existing user with Google credentials', async () => {
      const existingUser = new UserModel({
        name: 'Existing User',
        email: 'existing@example.com',
      });
      await existingUser.save();

      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => ({
          name: 'Existing User',
          email: 'existing@example.com',
          picture: 'https://example.com/picture.jpg',
        }),
      });

      const response = await request(app)
        .post('/api/auth/google')
        .send({
          credentialResponse: {
            credential: 'mock_credential',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toMatchObject({
        name: 'Existing User',
        email: 'existing@example.com',
        image: 'https://example.com/picture.jpg',
      });
    });

    it('should create a new user with Google credentials', async () => {
      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockResolvedValue({
        getPayload: () => ({
          name: 'New User',
          email: 'new@example.com',
          picture: 'https://example.com/newpicture.jpg',
        }),
      });

      const response = await request(app)
        .post('/api/auth/google')
        .send({
          credentialResponse: {
            credential: 'mock_credential',
          },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user).toMatchObject({
        name: 'New User',
        email: 'new@example.com',
        image: 'https://example.com/newpicture.jpg',
      });

      const newUser = await UserModel.findOne({ email: 'new@example.com' });
      expect(newUser).toBeTruthy();
    });

    it('should handle Google authentication failure', async () => {
      (OAuth2Client.prototype.verifyIdToken as jest.Mock).mockRejectedValue(
        new Error('Invalid token')
      );

      const response = await request(app)
        .post('/api/auth/google')
        .send({
          credentialResponse: {
            credential: 'invalid_credential',
          },
        });

      expect(response.status).toBe(400);
    });

    it('should handle missing credential in request', async () => {
      const response = await request(app).post('/api/auth/google').send({
        credentialResponse: {},
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Protected Routes', () => {
    it('should return 401 when accessing a protected route without authentication', async () => {
      const response = await request(app).get('/api/user/some-protected-route');
      expect(response.status).toBe(404);
    });
  });

  describe('Premium User Functionality', () => {
    let userId: string;

    beforeEach(async () => {
      const newUser = createUserObject(
        'Premium User',
        'premium@example.com',
        'password123'
      );
      await registerUser(app, newUser);
      const user = await UserModel.findOne({ email: 'premium@example.com' });
      userId = user._id.toString();
    });

    it('should set a user as premium', async () => {
      const setPremiumResponse = await setPremium(app, userId, true);

      expect(setPremiumResponse.status).toBe(200);
      expect(setPremiumResponse.body).toHaveProperty('isPremium', true);

      const updatedUser = await UserModel.findById(userId);
      expect(updatedUser.isPremium).toBe(true);
    });

    it('should return 400 for invalid isPremium value', async () => {
      const response = await request(app)
        .post(`/api/user/${userId}/set-premium`)
        .send({ isPremium: 'not a boolean' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid isPremium value');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeUserId = new mongoose.Types.ObjectId().toString();

      const response = await setPremium(app, fakeUserId, true);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});
