import request from 'supertest';
import mongoose from 'mongoose';
import initApp from '../app';
import PreviewModel from '../models/previewModel';
import { Express } from 'express';
import * as downloadResumeService from '../services/downloadResume.service';

jest.mock('../services/downloadResume.service');

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await PreviewModel.deleteMany({});
});

describe('CV Controller', () => {
  describe('downloadCV', () => {
    it('should handle errors when downloading CV', async () => {
      jest
        .spyOn(downloadResumeService, 'downloadResume')
        .mockRejectedValue(new Error('Download failed'));

      const response = await request(app)
        .post('/api/resume/download-cv')
        .send({ url: 'http://example.com/cv' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error generating PDF');
    });
  });

  describe('updatePreviewModelAndSetUrlForPreview', () => {
    it('should create a new preview and return URL', async () => {
      const resumeData = {
        fullName: 'John Doe',
        jobTitle: 'Developer',
      };

      const response = await request(app)
        .post('/api/resume/create-preview')
        .send(resumeData);

      expect(response.status).toBe(200);
      expect(response.body.url).toMatch(
        /^http:\/\/localhost:5173\/preview\/[\w-]+\/clear$/
      );

      const savedPreview = await PreviewModel.findOne({
        id: response.body.url.split('/')[4],
      });
      expect(savedPreview).toBeTruthy();
      expect(savedPreview?.resumeData).toEqual(resumeData);
    });
  });

  describe('getPreviewCV', () => {
    it('should return preview data if found', async () => {
      const previewData = {
        id: 'test-preview-id',
        resumeData: {
          fullName: 'Test User',
          jobTitle: 'Tester',
        },
      };
      await PreviewModel.create(previewData);

      const response = await request(app).get(`/api/preview/${previewData.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(previewData.resumeData);
    });

    it('should return 404 if preview not found', async () => {
      const response = await request(app).get('/api/preview/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Data not found');
    });
  });
});
