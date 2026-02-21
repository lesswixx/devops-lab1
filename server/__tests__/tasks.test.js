const { getDb, closeDb } = require('../src/db');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../src/tasks');

beforeAll(() => {
  process.env.DB_PATH = ':memory:';
});

afterAll(() => {
  closeDb();
});

beforeEach(() => {
  const db = getDb();
  db.exec('DELETE FROM tasks');
});

describe('Tasks CRUD operations', () => {
  test('createTask creates a new task and returns it', () => {
    const task = createTask({ title: 'Test task', description: 'A description' });
    expect(task).toHaveProperty('id');
    expect(task.title).toBe('Test task');
    expect(task.description).toBe('A description');
    expect(task.status).toBe('pending');
  });

  test('getAllTasks returns all tasks', () => {
    createTask({ title: 'Task 1' });
    createTask({ title: 'Task 2' });
    const tasks = getAllTasks();
    expect(tasks).toHaveLength(2);
  });

  test('getTaskById returns the correct task', () => {
    const created = createTask({ title: 'Find me' });
    const found = getTaskById(created.id);
    expect(found.title).toBe('Find me');
  });

  test('getTaskById returns undefined for non-existent id', () => {
    const found = getTaskById(9999);
    expect(found).toBeUndefined();
  });

  test('updateTask updates fields correctly', () => {
    const created = createTask({ title: 'Original' });
    const updated = updateTask(created.id, { title: 'Updated', status: 'done' });
    expect(updated.title).toBe('Updated');
    expect(updated.status).toBe('done');
  });

  test('updateTask returns null for non-existent id', () => {
    const result = updateTask(9999, { title: 'Nope' });
    expect(result).toBeNull();
  });

  test('deleteTask removes and returns the task', () => {
    const created = createTask({ title: 'Delete me' });
    const deleted = deleteTask(created.id);
    expect(deleted.title).toBe('Delete me');
    expect(getTaskById(created.id)).toBeUndefined();
  });

  test('deleteTask returns null for non-existent id', () => {
    const result = deleteTask(9999);
    expect(result).toBeNull();
  });
});
