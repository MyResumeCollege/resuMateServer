import request from 'supertest';
import { Express } from 'express';
import { IUser } from '../types/user.type';
import { Resume } from '../types/resume.type';

// Test helper function
// User object builder function
export const createUserObject = (
  email: string,
  password: string,
  name: string
): Partial<IUser> => {
  return {
    email,
    password,
    name,
    isPremium: false,
  };
};

// Resume object builder function
export const createResumeObject = (
  fullName: string,
  phoneNumber: string,
  email: string,
  jobTitle: string,
  bio: string,
  skills: string,
  experiences: string,
  educations: string,
  languages: string
): Partial<Resume> => {
  return {
    fullName,
    phoneNumber,
    email,
    jobTitle,
    bio,
    skills,
    experiences,
    educations,
    languages
  };
};
// Register user function
export const registerUser = async (app: Express, user: Partial<IUser>) => {
  return await request(app).post('/api/auth/register').send(user);
};

// Login user function
export const loginUser = async (
  app: Express,
  email: string,
  password: string
) => {
  return await request(app).post('/api/auth/login').send({ email, password });
};

// Logout user function
export const logoutUser = async (app: Express, refreshToken: string) => {
  return await request(app)
    .post('/api/auth/logout')
    .set('Authorization', `Bearer ${refreshToken}`);
};

// Get user resume previews function
export const getUserResumePreviews = async (
  app: Express,
  userId: string,
  accessToken: string
) => {
  return await request(app)
    .get(`/api/user/${userId}/resume-previews`)
    .set('Authorization', `Bearer ${accessToken}`);
};

// Create or update resume function
export const upsertResume = async (
  app: Express,
  userId: string,
  resume: Partial<Resume>,
  accessToken: string
) => {
  return await request(app)
    .post(`/api/user/${userId}/upsert`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send(resume);
};

// Get resume by ID function
export const getResumeById = async (
  app: Express,
  userId: string,
  resumeId: string,
  accessToken: string
) => {
  return await request(app)
    .get(`/api/user/${userId}/${resumeId}`)
    .set('Authorization', `Bearer ${accessToken}`);
};

// Delete resume function
export const deleteResume = async (
  app: Express,
  userId: string,
  resumeId: string,
  accessToken: string
) => {
  return await request(app)
    .delete(`/api/user/${userId}/${resumeId}`)
    .set('Authorization', `Bearer ${accessToken}`);
};

// Generate resume function
export const generateResume = async (
  app: Express,
  resumeData: Partial<Resume>,
  accessToken: string
) => {
  return await request(app)
    .post('/api/resume/generate-resume')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(resumeData);
};

// Set user premium status function
export const setUserPremiumStatus = async (
  app: Express,
  userId: string,
  isPremium: boolean,
  accessToken: string
) => {
  return await request(app)
    .post(`/api/user/${userId}/set-premium`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({ isPremium });
};
