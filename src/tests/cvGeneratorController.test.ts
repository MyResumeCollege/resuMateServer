import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import {
  createUserObject,
  registerUser,
  loginAccount,
  createResumeObject,
  upsertCv,
  getResumePreviews,
  getResumeUrl,
  deleteResume,
  generateResumeFromScratch,
  regenerateSection,
  createPreview,
  getPreviewCV,
} from '../helpers/testHelpers';
import UserModel from '../models/userModel';
import ResumeModel from '../models/resumeModel';
import PreviewModel from '../models/previewModel';
import * as GroqAIService from '../services/GroqAI.service';

jest.mock('../services/GroqAI.service');

let app: Express;
let accessToken: string;
let userId: string;

beforeAll(async () => {
  app = await initApp();
  await UserModel.deleteMany();
  await ResumeModel.deleteMany();
  await PreviewModel.deleteMany();

  // Register and login a user to get an access token
  const newUser = createUserObject(
    'Test User',
    'test@example.com',
    'password123'
  );
  await registerUser(app, newUser);
  const loginResponse = await loginAccount(
    app,
    'test@example.com',
    'password123'
  );
  accessToken = loginResponse.body.accessToken;
  userId = loginResponse.body.user._id;
}, 10000);

afterAll(async () => {
  await UserModel.deleteMany();
  await ResumeModel.deleteMany();
  await PreviewModel.deleteMany();
  await mongoose.connection.close();
});

describe('CV Operations', () => {
  let resumeId: string;

  describe('CV Generation and Management', () => {
    it('should generate a resume from scratch', async () => {
      const resumeData = {
        bio: 'Experienced software developer',
        experiences: [
          {
            id: '1',
            jobTitle: 'Senior Developer',
            employer: 'Tech Co',
            city: 'San Francisco',
            startDate: { month: 'Jan', year: '2018' },
            endDate: { month: 'Present', year: '' },
            isCurrent: true,
            description: 'Leading development team',
          },
        ],
        educations: [
          {
            id: '1',
            degree: 'Computer Science',
            school: 'University of Technology',
            startDate: { month: 'Sep', year: '2014' },
            endDate: { month: 'Jun', year: '2018' },
            isCurrent: false,
            description: "Bachelor's degree",
          },
        ],
      };

      const response = await generateResumeFromScratch(
        app,
        resumeData,
        accessToken
      );
      expect(response.status).toBe(200);
    });

    it('should handle 500 error when generating a resume', async () => {
      // Mock the generateResume function to throw an error
      (GroqAIService.generateResume as jest.Mock).mockRejectedValueOnce(
        new Error('Mocked error')
      );

      const resumeData = {
        bio: 'Error-prone developer',
        experiences: [],
        educations: [],
      };

      const response = await generateResumeFromScratch(
        app,
        resumeData,
        accessToken
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error generating resume.');
    });

    it('should upsert a CV', async () => {
      const resumeData = createResumeObject(
        'John Doe',
        'Software Engineer',
        'Experienced developer',
        'JavaScript, Python',
        'English, Spanish',
        1,
        'en'
      );

      const response = await upsertCv(app, userId, resumeData, accessToken);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      resumeId = response.body._id;
    });

    it('should get resume previews', async () => {
      const response = await getResumePreviews(app, userId, accessToken);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get a resume URL', async () => {
      const response = await getResumeUrl(app, userId, resumeId, accessToken);
      expect(response.status).toBe(200);
      expect(typeof response.text).toBe('string');
    });

    it('should regenerate a section', async () => {
      const sectionData =
        'Regenerate this section about software development skills';
      const response = await regenerateSection(
        app,
        { data: sectionData },
        accessToken
      );
      expect(response.status).toBe(200);
      expect(typeof response.text).toBe('string');
    });

    it('should handle 500 error when regenerating a section', async () => {
      // Mock the generateSection function to throw an error
      (GroqAIService.generateSection as jest.Mock).mockRejectedValueOnce(
        new Error('Mocked section error')
      );

      const sectionData = 'Error-prone section';
      const response = await regenerateSection(
        app,
        { data: sectionData },
        accessToken
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error generating section.');
    });
  });
});
