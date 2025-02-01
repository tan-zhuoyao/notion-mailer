import request from 'supertest';
import  server from '..';

describe('Server', () => {
  afterAll(() => {
    server.close(); // Close server after tests
  });

  it('should respond with "Hello World" and status 200', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World');
  });
});