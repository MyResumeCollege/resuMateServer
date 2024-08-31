import request from 'supertest';
import { Express } from 'express';
import { Resume } from '../types/resume.type';
import { IUser } from '../types/user.type';

// User related functions

export const createUserObject = (
  name: string,
  email: string,
  password: string
): Partial<IUser> => {
  return {
    name,
    email,
    password,
  };
};

export const registerUser = async (app: Express, user: Partial<IUser>) => {
  const response = await request(app).post('/api/auth/register').send(user);
  return response;
};

// Login account function //
export const loginAccount = async (
  app: Express,
  email: string,
  password: string
) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return response;
};

// Logout account function //
export const logoutUser = async (app: Express, refreshToken: string) => {
  const response = await request(app)
    .post('/api/auth/logout')
    .set('Authorization', `JWT ${refreshToken}`);
  return response;
};

export const checkIfPremium = async (
  app: Express,
  userId: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/api/user/${userId}/is-premium`)
    .set('Authorization', `Bearer ${accessToken}`);
  return response;
};

export const setPremium = async (
  app: Express,
  userId: string,
  isPremium: boolean
) => {
  return request(app)
    .post(`/api/user/${userId}/set-premium`)
    .send({ isPremium });
};

// Resume related functions

export const createResumeObject = (
  fullName: string,
  jobTitle: string,
  bio: string,
  skills: string,
  languages: string,
  template: number,
  resumeLanguage: string
): Partial<Resume> => {
  return {
    fullName,
    jobTitle,
    bio,
    skills,
    languages,
    template,
    resumeLanguage,
  };
};

export const upsertCv = async (
  app: Express,
  userId: string,
  resume: Partial<Resume>,
  accessToken: string
) => {
  const response = await request(app)
    .post(`/api/user/${userId}/upsert`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(resume);
  return response;
};

export const getResumePreviews = async (
  app: Express,
  userId: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/api/user/${userId}/resume-previews`)
    .set('Authorization', `Bearer ${accessToken}`);
  return response;
};

export const getResumeUrl = async (
  app: Express,
  userId: string,
  resumeId: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/api/user/${userId}/${resumeId}`)
    .set('Authorization', `Bearer ${accessToken}`);
  return response;
};

export const deleteResume = async (
  app: Express,
  userId: string,
  resumeId: string,
  accessToken: string
) => {
  const response = await request(app)
    .delete(`/api/user/${userId}/${resumeId}`)
    .set('Authorization', `Bearer ${accessToken}`);
  return response;
};

// CV generation and preview functions

export const generateResumeFromScratch = async (
  app: Express,
  data: any,
  accessToken: string
) => {
  const response = await request(app)
    .post('/api/resume/generate-resume')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(data);
  return response;
};

export const regenerateSection = async (
  app: Express,
  data: any,
  accessToken: string
) => {
  const response = await request(app)
    .post('/api/resume/generate-section')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(data);
  return response;
};

export const createPreview = async (
  app: Express,
  data: any,
  accessToken: string
) => {
  const response = await request(app)
    .post('/api/preview/create-preview')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(data);
  return response;
};

export const getPreviewCV = async (
  app: Express,
  previewId: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/api/preview/${previewId}`)
    .set('Authorization', `Bearer ${accessToken}`);
  return response;
};

// LinkedIn related function

export const fetchLinkedinProfileData = async (
  app: Express,
  profileLink: string,
  accessToken: string
) => {
  const response = await request(app)
    .post('/api/linkedin/profile-data')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ profile_link: profileLink });
  return response;
};

// CV upload function

export const uploadResume = async (
  app: Express,
  file: Buffer,
  accessToken: string
) => {
  const response = await request(app)
    .post('/api/resume/upload-resume')
    .set('Authorization', `Bearer ${accessToken}`)
    .attach('file', file, 'resume.pdf');
  return response;
};

// Password reset functions

export const generateResetToken = async (app: Express, email: string) => {
  const response = await request(app)
    .post('/api/auth/forget-password')
    .send({ email });
  return response;
};

export const verifyResetToken = async (app: Express, token: string) => {
  const response = await request(app).get(`/api/auth/reset-password/${token}`);
  return response;
};

export const resetPassword = async (
  app: Express,
  token: string,
  password: string
) => {
  const response = await request(app)
    .post(`/api/auth/reset-password/${token}`)
    .send({ password });
  return response;
};
