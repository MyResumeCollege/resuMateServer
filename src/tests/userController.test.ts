import request from 'supertest';
import mongoose from 'mongoose';
import initApp from '../app';
import UserModel from '../models/userModel';
import ResumeModel from '../models/resumeModel';
import PreviewModel from '../models/previewModel';
import { Express } from 'express';

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await UserModel.deleteMany({});
  await ResumeModel.deleteMany({});
  await PreviewModel.deleteMany({});
});

describe('User Controller', () => {
  describe('setPremium', () => {
    it('should set premium status for a user', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
        isPremium: false,
      });
      const response = await request(app)
        .post(`/api/user/${user._id.toString()}/set-premium`)
        .send({ isPremium: true });
      expect(response.status).toBe(200);
      expect(response.body.isPremium).toBe(true);
    });

    it('should return 400 if isPremium is not a boolean', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
        isPremium: false,
      });
      const response = await request(app)
        .post(`/api/user/${user._id.toString()}/set-premium`)
        .send({ isPremium: 'not a boolean' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid isPremium value');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/user/${fakeId.toString()}/set-premium`)
        .send({ isPremium: true });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if database operation fails', async () => {
      jest
        .spyOn(UserModel, 'findByIdAndUpdate')
        .mockRejectedValueOnce(new Error('Database error'));
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
        isPremium: false,
      });
      const response = await request(app)
        .post(`/api/user/${user._id.toString()}/set-premium`)
        .send({ isPremium: true });
      expect(response.status).toBe(500);
    });
  });

  describe('getResumePreviews', () => {
    it('should return resume previews for a user', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resume = await ResumeModel.create({
        fullName: 'Test User',
        jobTitle: 'Developer',
        resumePreviewId: 'test-preview-id',
      });
      await UserModel.findByIdAndUpdate(user._id, {
        $push: { resumes: resume._id },
      });

      const response = await request(app).get(
        `/api/user/${user._id.toString()}/resume-previews`
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].jobTitle).toBe('Developer');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/user/${fakeId.toString()}/resume-previews`
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('getResumeUrl', () => {
    it('should return resume preview ID', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resume = await ResumeModel.create({
        fullName: 'Test User',
        jobTitle: 'Developer',
        resumePreviewId: 'test-preview-id',
      });
      await UserModel.findByIdAndUpdate(user._id, {
        $push: { resumes: resume._id },
      });

      const response = await request(app).get(
        `/api/user/${user._id.toString()}/${resume._id.toString()}`
      );
      expect(response.status).toBe(200);
      expect(response.text).toBe('test-preview-id');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/user/${fakeId.toString()}/${fakeId.toString()}`
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 404 if resume not found', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/user/${user._id.toString()}/${fakeId.toString()}`
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Resume not found');
    });

    it('should return 500 if database operation fails', async () => {
      jest
        .spyOn(UserModel, 'findById')
        .mockRejectedValueOnce(new Error('Database error'));
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(
        `/api/user/${user._id.toString()}/${fakeId.toString()}`
      );
      expect(response.status).toBe(500);
    });
  });

  describe('upsertCv', () => {
    it('should create a new resume', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resumeData = {
        resumePreviewId: 'test-preview-id',
        fullName: 'Test User',
        jobTitle: 'Developer',
        bio: 'Test bio',
        skills: 'JavaScript, TypeScript',
        languages: 'English',
        template: 1,
        resumeLanguage: 'en',
      };

      const response = await request(app)
        .post(`/api/user/${user._id.toString()}/upsert`)
        .send(resumeData);

      expect(response.status).toBe(201);
      expect(response.body.fullName).toBe('Test User');
      expect(response.body.jobTitle).toBe('Developer');
    });

    it('should update an existing resume', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const existingResume = await ResumeModel.create({
        resumePreviewId: 'test-preview-id',
        fullName: 'Test User',
        jobTitle: 'Developer',
        bio: 'Old bio',
        skills: 'JavaScript',
        languages: 'English',
        template: 1,
        resumeLanguage: 'en',
      });
      await UserModel.findByIdAndUpdate(user._id, {
        $push: { resumes: existingResume._id },
      });

      const updatedResumeData = {
        resumePreviewId: 'test-preview-id',
        fullName: 'Test User',
        jobTitle: 'Senior Developer',
        bio: 'Updated bio',
        skills: 'JavaScript, TypeScript',
        languages: 'English, Spanish',
        template: 2,
        resumeLanguage: 'es',
      };

      const response = await request(app)
        .post(`/api/user/${user._id.toString()}/upsert`)
        .send(updatedResumeData);

      expect(response.status).toBe(201);
      expect(response.body.jobTitle).toBe('Senior Developer');
      expect(response.body.bio).toBe('Updated bio');
    });

    it('should return 404 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const resumeData = {
        resumePreviewId: 'test-preview-id',
        fullName: 'Test User',
        jobTitle: 'Developer',
        bio: 'Test bio',
        skills: 'JavaScript, TypeScript',
        languages: 'English',
        template: 1,
        resumeLanguage: 'en',
      };

      const response = await request(app)
        .post(`/api/user/${fakeId.toString()}/upsert`)
        .send(resumeData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 if database operation fails', async () => {
      jest
        .spyOn(ResumeModel, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resumeData = {
        resumePreviewId: 'test-preview-id',
        fullName: 'Test User',
        jobTitle: 'Developer',
        bio: 'Test bio',
        skills: 'JavaScript, TypeScript',
        languages: 'English',
        template: 1,
        resumeLanguage: 'en',
      };

      const response = await request(app)
        .post(`/api/user/${user._id.toString()}/upsert`)
        .send(resumeData);

      expect(response.status).toBe(500);
    });
  });

  describe('deleteCv', () => {
    it('should delete a resume', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resume = await ResumeModel.create({
        fullName: 'Test User',
        jobTitle: 'Developer',
        resumePreviewId: 'test-preview-id',
      });
      await UserModel.findByIdAndUpdate(user._id, {
        $push: { resumes: resume._id },
      });

      const response = await request(app).delete(
        `/api/user/${user._id.toString()}/${resume.resumePreviewId}`
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Resume deleted successfully');

      const deletedResume = await ResumeModel.findById(resume._id);
      expect(deletedResume).toBeNull();
    });

    it('should return 404 if resume not found', async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const fakeResumeId = 'non-existent-preview-id';

      const response = await request(app).delete(
        `/api/user/${user._id.toString()}/${fakeResumeId}`
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Resume not found');
    });

    it("should return 404 if user not found or resumeId not in user's resumes array", async () => {
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resume = await ResumeModel.create({
        fullName: 'Test User',
        jobTitle: 'Developer',
        resumePreviewId: 'test-preview-id',
      });

      const response = await request(app).delete(
        `/api/user/${user._id.toString()}/${resume.resumePreviewId}`
      );
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        "User not found or resumeId not in user's resumes array"
      );
    });

    it('should return 500 if database operation fails', async () => {
      jest
        .spyOn(ResumeModel, 'findOne')
        .mockRejectedValueOnce(new Error('Database error'));
      const user = await UserModel.create({
        name: 'Test User',
        email: 'test@example.com',
      });
      const resume = await ResumeModel.create({
        fullName: 'Test User',
        jobTitle: 'Developer',
        resumePreviewId: 'test-preview-id',
      });
      await UserModel.findByIdAndUpdate(user._id, {
        $push: { resumes: resume._id },
      });

      const response = await request(app).delete(
        `/api/user/${user._id.toString()}/${resume.resumePreviewId}`
      );
      expect(response.status).toBe(500);
    });
  });
});
