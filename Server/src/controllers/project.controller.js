import Project from '../models/Project.js';

export async function listProjects(req, res) {
  const projects = await Project.find({ userId: req.user.id, ...(req.query.clientId ? { clientId: req.query.clientId } : {}) })
    .sort({ createdAt: -1 });
  res.json(projects);
}

export async function createProject(req, res) {
  const data = { ...req.body, userId: req.user.id };
  const created = await Project.create(data);
  res.status(201).json(created);
}

export async function getProject(req, res) {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
}

export async function updateProject(req, res) {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!project) return res.status(404).json({ message: 'Not found' });
  res.json(project);
}

export async function deleteProject(req, res) {
  const deleted = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}


