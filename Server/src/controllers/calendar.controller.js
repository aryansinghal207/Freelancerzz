import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import prisma from '../prisma.js';

dayjs.extend(isoWeek);

export async function daily(req, res) {
  const day = req.query.date ? dayjs(req.query.date) : dayjs();
  const start = day.startOf('day').toDate();
  const end = day.endOf('day').toDate();
  const sessions = await prisma.workSession.findMany({
    where: { userId: req.userId, startTime: { gte: start, lte: end } },
    orderBy: { startTime: 'asc' }
  });
  res.json(sessions);
}

export async function weekly(req, res) {
  const day = req.query.date ? dayjs(req.query.date) : dayjs();
  const start = day.startOf('week').toDate();
  const end = day.endOf('week').toDate();
  const sessions = await prisma.workSession.findMany({
    where: { userId: req.userId, startTime: { gte: start, lte: end } },
    orderBy: { startTime: 'asc' }
  });
  res.json(sessions);
}

export async function monthly(req, res) {
  const day = req.query.date ? dayjs(req.query.date) : dayjs();
  const start = day.startOf('month').toDate();
  const end = day.endOf('month').toDate();
  const sessions = await prisma.workSession.findMany({
    where: { userId: req.userId, startTime: { gte: start, lte: end } },
    orderBy: { startTime: 'asc' }
  });
  res.json(sessions);
}
