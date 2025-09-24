import Task from '../models/Task.js';

export async function listTasks(req, res) {
  const filter = { userId: req.user.id };
  if (req.query.projectId) filter.projectId = req.query.projectId;
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
}

export async function createTask(req, res) {
  const data = { ...req.body, userId: req.user.id };
  const created = await Task.create(data);
  res.status(201).json(created);
}

export async function updateTask(req, res) {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Not found' });
  res.json(task);
}

export async function deleteTask(req, res) {
  const deleted = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}


