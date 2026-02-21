const request = require('supertest');

process.env.DB_PATH = ':memory:';

const app = require('../src/app');
const { closeDb, getDb } = require('../src/db');

afterAll(() => {
  closeDb();
});

beforeEach(() => {
  const db = getDb();
  db.exec('DELETE FROM tasks');
});

describe('REST API endpoints', () => {
  describe('POST /api/tasks', () => {
    test('creates a task with valid data', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'New task', description: 'Details' });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New task');
      expect(res.body).toHaveProperty('id');
    });

    test('returns 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });
      expect(res.status).toBe(400);
    });

    test('returns 400 for invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task', status: 'invalid' });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/tasks', () => {
    test('returns empty array when no tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    test('returns all tasks', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('returns a task by id', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Find me' });
      const res = await request(app).get(`/api/tasks/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Find me');
    });

    test('returns 404 for non-existent task', async () => {
      const res = await request(app).get('/api/tasks/9999');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('updates a task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Old' });
      const res = await request(app)
        .put(`/api/tasks/${created.body.id}`)
        .send({ title: 'New', status: 'done' });
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New');
      expect(res.body.status).toBe('done');
    });

    test('returns 404 for non-existent task', async () => {
      const res = await request(app).put('/api/tasks/9999').send({ title: 'Nope' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('deletes a task', async () => {
      const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });
      const res = await request(app).delete(`/api/tasks/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted');
    });

    test('returns 404 for non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/9999');
      expect(res.status).toBe(404);
    });
  });
});
