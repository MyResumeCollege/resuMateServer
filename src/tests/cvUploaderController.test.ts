import request from 'supertest';
import mongoose from 'mongoose';
import initApp from '../app';
import { Express } from 'express';
import * as GroqAIService from '../services/GroqAI.service';

// Mock the entire pdf-parse module
jest.mock('pdf-parse', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      text: 'This is a mock PDF text',
      numpages: 1,
      numrender: 1,
      info: {
        PDFFormatVersion: 1.7,
        IsAcroFormPresent: false,
        IsXFAPresent: false,
        Creator: 'Mock Creator',
        Producer: 'Mock Producer',
        CreationDate: 'D:20230101000000Z',
      },
      metadata: null,
      version: '1.10.100',
    });
  });
});

jest.mock('../services/GroqAI.service');

let app: Express;

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('CV Uploader Controller', () => {
  describe('generateResumeFromExistCV', () => {
    it('should generate resume from uploaded PDF', async () => {
      const mockImprovedResume = 'This is the improved resume';

      (
        GroqAIService.improveResume as jest.MockedFunction<
          typeof GroqAIService.improveResume
        >
      ).mockResolvedValue(mockImprovedResume);

      const response = await request(app)
        .post('/api/resume/upload-resume')
        .attach('file', Buffer.from('fake pdf content'), 'resume.pdf');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ CVUploadResponse: mockImprovedResume });
      expect(GroqAIService.improveResume).toHaveBeenCalledWith({
        detailedCV: 'This is a mock PDF text',
      });
    });

    it('should return 400 if no file is uploaded', async () => {
      const response = await request(app).post('/api/resume/upload-resume');

      expect(response.status).toBe(400);
      expect(response.text).toBe('No file uploaded.');
    });

    it('should return 500 if PDF parsing fails', async () => {
      const pdfParse = require('pdf-parse');
      pdfParse.mockImplementationOnce(() =>
        Promise.reject(new Error('PDF parsing failed'))
      );

      const response = await request(app)
        .post('/api/resume/upload-resume')
        .attach('file', Buffer.from('fake pdf content'), 'resume.pdf');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error uploading file.');
    });

    it('should return 500 if resume improvement fails', async () => {
      (
        GroqAIService.improveResume as jest.MockedFunction<
          typeof GroqAIService.improveResume
        >
      ).mockRejectedValue(new Error('Resume improvement failed'));

      const response = await request(app)
        .post('/api/resume/upload-resume')
        .attach('file', Buffer.from('fake pdf content'), 'resume.pdf');

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error uploading file.');
    });
  });
});
