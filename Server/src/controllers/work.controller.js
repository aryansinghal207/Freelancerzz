import dayjs from 'dayjs';
import prisma from '../prisma.js';

function computeRate({ project }) {
  return project?.hourlyRate ?? undefined;
}

export async function startTimer(req, res) {
  const { projectId, taskId, note } = req.body;
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: req.userId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const rate = computeRate({ project });
  const ws = await prisma.workSession.create({
    data: {
      userId: req.userId,
      projectId,
      taskId,
      note,
      startTime: new Date(),
      hourlyRate: rate,
    }
  });
  res.status(201).json(ws);
}

export async function stopTimer(req, res) {
  const { id } = req.params;
  const ws = await prisma.workSession.findFirst({ where: { id, userId: req.userId } });
  if (!ws) return res.status(404).json({ message: 'Session not found' });
  if (ws.endTime) return res.status(400).json({ message: 'Already stopped' });
  const endTime = new Date();
  const minutes = (endTime - ws.startTime) / 60000;
  const durationMinutes = Math.max(1 / 60, Math.round(minutes * 1000) / 1000);
  const updated = await prisma.workSession.update({
    where: { id: ws.id },
    data: { endTime, durationMinutes }
  });
  res.json(updated);
}

export async function manualLog(req, res) {
  const { projectId, taskId, note, startTime, endTime, durationMinutes, hourlyRate } = req.body;
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: req.userId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const start = startTime ? new Date(startTime) : new Date();
  const end = endTime ? new Date(endTime) : undefined;
  let duration = typeof durationMinutes === 'number' ? durationMinutes : undefined;
  const ws = await prisma.workSession.create({
    data: {
      userId: req.userId,
      projectId,
      taskId,
      note,
      startTime: start,
      endTime: end,
      durationMinutes: duration,
      hourlyRate: hourlyRate ?? project.hourlyRate
    }
  });

  if (!duration && ws.endTime) {
    const minutes = (ws.endTime - ws.startTime) / 60000;
    duration = Math.max(1 / 60, Math.round(minutes * 1000) / 1000);
    await prisma.workSession.update({ where: { id: ws.id }, data: { durationMinutes: duration } });
    ws.durationMinutes = duration;
  }

  res.status(201).json(ws);
}

export async function listSessions(req, res) {
  const { projectId, from, to } = req.query;
  const where = { userId: req.userId, projectId: projectId || undefined };
  if (from || to) {
    where.startTime = {};
    if (from) where.startTime.gte = dayjs(from).toDate();
    if (to) where.startTime.lte = dayjs(to).toDate();
  }
  const sessions = await prisma.workSession.findMany({
    where,
    orderBy: { startTime: 'desc' }
  });
  res.json(sessions);
}

export async function deleteSession(req, res) {
  const result = await prisma.workSession.deleteMany({
    where: { id: req.params.id, userId: req.userId }
  });
  if (result.count === 0) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}
