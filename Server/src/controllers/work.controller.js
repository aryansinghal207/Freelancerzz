import dayjs from 'dayjs';
import Project from '../models/Project.js';
import WorkSession from '../models/WorkSession.js';

function computeRate({ project }) {
  return project.hourlyRate ?? undefined;
}

export async function startTimer(req, res) {
  const { projectId, taskId, note } = req.body;
  const project = await Project.findOne({ _id: projectId, userId: req.user.id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const rate = computeRate({ project });
  const ws = await WorkSession.create({
    userId: req.user.id,
    projectId,
    taskId,
    note,
    startTime: new Date(),
    hourlyRate: rate,
  });
  res.status(201).json(ws);
}

export async function stopTimer(req, res) {
  const { id } = req.params;
  const ws = await WorkSession.findOne({ _id: id, userId: req.user.id });
  if (!ws) return res.status(404).json({ message: 'Session not found' });
  if (ws.endTime) return res.status(400).json({ message: 'Already stopped' });
  ws.endTime = new Date();
  const minutes = (ws.endTime - ws.startTime) / 60000;
  ws.durationMinutes = Math.max(1 / 60, Math.round(minutes * 1000) / 1000);
  await ws.save();
  res.json(ws);
}

export async function manualLog(req, res) {
  const { projectId, taskId, note, startTime, endTime, durationMinutes, hourlyRate } = req.body;
  const project = await Project.findOne({ _id: projectId, userId: req.user.id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const ws = await WorkSession.create({
    userId: req.user.id,
    projectId,
    taskId,
    note,
    startTime: startTime ? new Date(startTime) : new Date(),
    endTime: endTime ? new Date(endTime) : undefined,
    durationMinutes: typeof durationMinutes === 'number' ? durationMinutes : undefined,
    hourlyRate: hourlyRate ?? project.hourlyRate,
  });
  if (!ws.durationMinutes && ws.endTime) {
    const minutes = (ws.endTime - ws.startTime) / 60000;
    ws.durationMinutes = Math.max(1 / 60, Math.round(minutes * 1000) / 1000);
    await ws.save();
  }
  res.status(201).json(ws);
}

export async function listSessions(req, res) {
  const { projectId, from, to } = req.query;
  const filter = { userId: req.user.id };
  if (projectId) filter.projectId = projectId;
  if (from || to) {
    filter.startTime = {};
    if (from) filter.startTime.$gte = dayjs(from).toDate();
    if (to) filter.startTime.$lte = dayjs(to).toDate();
  }
  const sessions = await WorkSession.find(filter).sort({ startTime: -1 });
  res.json(sessions);
}

export async function deleteSession(req, res) {
  const deleted = await WorkSession.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}


