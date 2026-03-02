const request = require('supertest');
const app = require('../src/app');

describe('GET /api/v1/warehouse/nearest', () => {
  it('should return 400 if sellerId missing', async () => {
    const res = await request(app).get('/api/v1/warehouse/nearest?productId=1');
    expect(res.status).toBe(400);
  });

  it('should return 404 if seller not found', async () => {
    const res = await request(app).get('/api/v1/warehouse/nearest?sellerId=99999&productId=1');
    expect(res.status).toBe(404);
  });

  it('should return nearest warehouse for valid seller', async () => {
    const res = await request(app).get('/api/v1/warehouse/nearest?sellerId=1&productId=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('warehouseId');
    expect(res.body).toHaveProperty('warehouseLocation');
  });
});