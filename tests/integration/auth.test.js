import request from 'supertest';
import mongoose from 'mongoose';
import 'dotenv/config';
import app from '../../src/app.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
}, 30000);

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth Endpoints', () => {
  describe('POST /api/users/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({ name: 'Test User', email: 'not-an-email', password: 'password123' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/users/login', () => {
    it('should return 400 if password missing', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'test@test.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({ email: 'notexist@test.com', password: 'wrongpassword' });
      expect([401, 404]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    }, 15000);
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.status).toBe('healthy');
    });
  });
});