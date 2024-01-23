// test/authMiddleware.test.js
const assert = require('assert');
const express = require('express');
const supertest = require('supertest');
const authMiddleware = require('../src/index');

const app = express();

// Mocking a route that uses the auth middleware
app.get('/secured-route', authMiddleware({ secret: '123' }), (req, res) => {
  res.json({ message: 'You are authorized!' });
});

describe('Authentication Middleware', () => {
  it('should allow access with correct API key', async () => {
    const response = await supertest(app)
      .get('/secured-route')
      .set('Cookie', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmlzaGFuIiwiaWF0IjoxNzA2MDE5NDg5fQ.d9hVjx2we1NeWsWHiEpH77zaub7IidMbKrA3ugSWqjQ')
      .set('Authorization', `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibmlzaGFuIiwiaWF0IjoxNzA2MDE5NDg5fQ.d9hVjx2we1NeWsWHiEpH77zaub7IidMbKrA3ugSWqjQ'}`)
      .expect(200);

    assert.strictEqual(response.body.message, 'You are authorized!');
  });

  it('should deny access with incorrect API key', async () => {
    const response = await supertest(app)
      .get('/secured-route')
      .set('Cookie', '')
      .expect(401);

    assert.strictEqual(response.body.error, 'Unauthorized');
  });

});
