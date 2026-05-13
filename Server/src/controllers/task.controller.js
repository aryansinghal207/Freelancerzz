import prisma from '../prisma.js';

export async function listTasks(req, res) {
  const filter = { userId: req.userId, projectId: req.query.projectId || undefined };
  const tasks = await prisma.task.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });
  res.json(tasks);
}

export async function createTask(req, res) {
  const created = await prisma.task.create({
    data: { ...req.body, userId: req.userId }
  });
  res.status(201).json(created);
}

export async function updateTask(req, res) {
  const result = await prisma.task.updateMany({
    where: { id: req.params.id, userId: req.userId },
    data: req.body
  });
  if (result.count === 0) return res.status(404).json({ message: 'Not found' });
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  res.json(task);
}

export async function deleteTask(req, res) {
  const result = await prisma.task.deleteMany({
    where: { id: req.params.id, userId: req.userId }
  });
  if (result.count === 0) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}
