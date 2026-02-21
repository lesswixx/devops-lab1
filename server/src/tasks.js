const { getDb } = require('./db');

function getAllTasks() {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
}

function getTaskById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function createTask({ title, description = '', status = 'pending' }) {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)'
  ).run(title, description, status);
  return getTaskById(result.lastInsertRowid);
}

function updateTask(id, { title, description, status }) {
  const db = getDb();
  const existing = getTaskById(id);
  if (!existing) return null;

  const updated = {
    title: title ?? existing.title,
    description: description ?? existing.description,
    status: status ?? existing.status,
  };

  db.prepare(
    `UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(updated.title, updated.description, updated.status, id);

  return getTaskById(id);
}

function deleteTask(id) {
  const db = getDb();
  const existing = getTaskById(id);
  if (!existing) return null;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return existing;
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
