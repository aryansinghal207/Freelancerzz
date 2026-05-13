import prisma from '../prisma.js';

export async function listProjects(req, res) {
  const projects = await prisma.project.findMany({
    where: {
      userId: req.userId,
      clientId: req.query.clientId || undefined
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(projects);
}

export async function createProject(req, res) {
  const created = await prisma.project.create({
    data: { ...req.body, userId: req.userId }
  });
  res.status(201).json(created);
}

export async function getProject(req, res) {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, userId: req.userId }
  });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
}

export async function updateProject(req, res) {
  const result = await prisma.project.updateMany({
    where: { id: req.params.id, userId: req.userId },
    data: req.body
  });
  if (result.count === 0) return res.status(404).json({ message: 'Not found' });
  const project = await prisma.project.findUnique({ where: { id: req.params.id } });
  res.json(project);
}

export async function deleteProject(req, res) {
  const result = await prisma.project.deleteMany({
    where: { id: req.params.id, userId: req.userId }
  });
  if (result.count === 0) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}
