const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
const app = require('../lib/app');

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it.only('POST / creates a new shopping item with current user', async () => {
    const { agent, user } = await signUpUser();

    const newItem = { description: 'eggs', qty: 12 };
    const { status, body } = await agent.post('/api/v1/items').send(newItem);

    expect(status).toEqual(200);
    expect(body).toEqual({
      ...newItem,
      id: expect.any(String),
      user_id: user.id,
      bought: false,
    });
  });
});
