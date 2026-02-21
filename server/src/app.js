const express = require('express');
const cors = require('cors');
const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('./tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/tasks', (_req, res) => {
  const tasks = getAllTasks();
  res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = getTaskById(Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (status && !['pending', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const task = createTask({ title: title.trim(), description, status });
  res.status(201).json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status } = req.body;
  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  if (status && !['pending', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const task = updateTask(Number(req.params.id), { title: title?.trim(), description, status });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const task = deleteTask(Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json({ message: 'Task deleted', task });
});

module.exports = app;
