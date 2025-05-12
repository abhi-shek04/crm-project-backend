const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

let token;

describe('CRM API Integration Tests', () => {
  beforeAll(async () => {
    // Optionally, create a test user and get JWT token
    // For demo, assume a valid token is set in .env or use a mock
    token = process.env.TEST_JWT || '';
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should get all customers (protected)', async () => {
    const res = await request(app)
      .get('/api/customers')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get all campaigns (protected)', async () => {
    const res = await request(app)
      .get('/api/campaigns')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should parse a segment rule (AI endpoint)', async () => {
    const res = await request(app)
      .post('/api/ai/segment-rule')
      .set('Authorization', `Bearer ${token}`)
      .send({ prompt: "People who haven't shopped in 6 months and spent over 10K" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('rule');
  });
}); 