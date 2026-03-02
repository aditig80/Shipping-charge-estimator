const request = require('supertest');
const app = require('../src/app');

describe('GET /api/v1/shipping-charge', () => {
  it('should return 400 for invalid deliverySpeed', async () => {
    const res = await request(app).get('/api/v1/shipping-charge?warehouseId=1&customerId=1&deliverySpeed=ultra');
    expect(res.status).toBe(400);
  });

  it('should return shipping charge for valid params', async () => {
    const res = await request(app).get('/api/v1/shipping-charge?warehouseId=1&customerId=1&deliverySpeed=standard');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('shippingCharge');
  });
});

describe('POST /api/v1/shipping-charge/calculate', () => {
  it('should return full calculation for valid body', async () => {
    const res = await request(app).post('/api/v1/shipping-charge/calculate').send({
      sellerId: 1, customerId: 1, productId: 1, deliverySpeed: 'express'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('shippingCharge');
    expect(res.body).toHaveProperty('nearestWarehouse');
  });
});