import request from 'supertest';
import app from '../../src/app.js';

describe('OCR Endpoints', () => {
  describe('POST /api/users/scan-prescription', () => {
    it('should return 401 if no auth token provided', async () => {
      const res = await request(app)
        .post('/api/users/scan-prescription');

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 or 401 if invalid token and no image', async () => {
      const res = await request(app)
        .post('/api/users/scan-prescription')
        .set('Authorization', 'Bearer invalidtoken');

      expect([400, 401]).toContain(res.statusCode);
      expect(res.body.success).toBe(false);
    });
  });
});