const request = require('supertest');
const { setupDb, signUpUser } = require('./utils.js');
const app = require('../lib/app');

describe('/api/v1/items', () => {
  beforeEach(setupDb);

  it('POST / creates a new shopping item with current user', async () => {
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

  it('GET / returns all items associated with the authenticated User', async () => {
    // create a user
    const { agent } = await signUpUser();
    const { body: user1Item } = await agent.post('/api/v1/items').send({
      description: 'apples',
      qty: 6,
    });

    const { agent: agent2 } = await signUpUser({
      email: 'user2@email.com',
      password: 'password',
    });

    const { body: user2Item } = await agent2.post('/api/v1/items').send({
      description: 'eggs',
      qty: 12,
    });

    const resp1 = await agent.get('/api/v1/items');
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toEqual([user1Item]);

    const resp2 = await agent2.get('/api/v1/items');
    expect(resp2.status).toEqual(200);
    expect(resp2.body).toEqual([user2Item]);
  });

  it('GET /:id should get an item', async () => {
    const { agent } = await signUpUser();

    const { body: item } = await agent.post('/api/v1/items').send({
      description: 'apples',
      qty: 6,
    });

    const { status, body: got } = await agent.get(`/api/v1/items/${item.id}`);

    expect(status).toBe(200);
    expect(got).toEqual(item);
  });

  it('GET / should return a 401 if not authenticated', async () => {
    const { status } = await request(app).get('/api/v1/items');
    expect(status).toEqual(401);
  });

  it('UPDATE /:id should update an item', async () => {
    const { agent } = await signUpUser();

    const { body: item } = await agent.post('/api/v1/items').send({
      description: 'apples',
      qty: 6,
    });

    const { status, body: updated } = await agent
      .put(`/api/v1/items/${item.id}`)
      .send({ bought: true });

    expect(status).toBe(200);
    expect(updated).toEqual({ ...item, bought: true });
  });
});
