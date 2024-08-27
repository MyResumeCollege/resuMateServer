import request from 'supertest';
import express from 'express';
import linkedinController from '../controllers/linkedin.controller';
import * as linkedinService from '../services/linkedin.service';

jest.mock('../services/linkedin.service');

const app = express();
app.use(express.json());
app.post('/profile-data', linkedinController.fetchLinkedinProfileData);

describe('LinkedIn Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch LinkedIn profile data successfully', async () => {
    const mockProfileData = {
      name: 'John Doe',
      aboutSummaryText: 'Software Engineer',
      education: [
        {
          fieldOfStudy: 'Computer Science',
          institutionName: 'Tech University',
          dateStarted: '2015',
          dateEnded: '2019',
        },
      ],
      skills: [{ name: 'JavaScript' }],
      experience: [
        {
          title: 'Software Engineer',
          organisation: { name: 'Tech Corp' },
          location: 'San Francisco',
          dateStarted: '2019',
          dateEnded: 'Present',
        },
      ],
    };

    (linkedinService.getLinkedinProfileData as jest.Mock).mockResolvedValue(
      mockProfileData
    );

    const response = await request(app)
      .post('/profile-data')
      .send({ profile_link: 'https://www.linkedin.com/in/johndoe' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('bio', 'Software Engineer');
    expect(response.body.experiencePeriods).toHaveLength(1);
    expect(response.body.educationPeriods).toHaveLength(1);
    expect(response.body.skills).toHaveLength(1);
  });

  it('should return 400 if profile link is missing', async () => {
    const response = await request(app).post('/profile-data').send({});

    expect(response.status).toBe(400);
    expect(response.text).toBe('Profile link is required');
  });

  it('should return 500 if there is an error fetching profile data', async () => {
    (linkedinService.getLinkedinProfileData as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch profile')
    );

    const response = await request(app)
      .post('/profile-data')
      .send({ profile_link: 'https://www.linkedin.com/in/johndoe' });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Failed to fetch profile');
  });
});
