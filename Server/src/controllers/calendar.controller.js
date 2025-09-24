import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import WorkSession from '../models/WorkSession.js';

dayjs.extend(isoWeek);

export async function daily(req, res) {
  const day = req.query.date ? dayjs(req.query.date) : dayjs();
  const start = day.startOf('day');
  const end = day.endOf('day');
  const sessions = await WorkSession.find({ userId: req.user.id, startTime: { $gte: start.toDate(), $lte: end.toDate() } }).sort({ startTime: 1 });
  res.json(sessions);
}

export async function weekly(req, res) {
  const day = req.query.date ? dayjs(req.query.date) : dayjs();
  const start = day.startOf('week');
  const end = day.endOf('week');
  const sessions = await WorkSession.find({ userId: req.user.id, startTime: { $gte: start.toDate(), $lte: end.toDate() } }).sort({ startTime: 1 });
  res.json(sessions);
}

export async function monthly(req, res) {
  const day = req.query.date ? dayjs(req.query.date) : dayjs();
  const start = day.startOf('month');
  const end = day.endOf('month');
  const sessions = await WorkSession.find({ userId: req.user.id, startTime: { $gte: start.toDate(), $lte: end.toDate() } }).sort({ startTime: 1 });
  res.json(sessions);
}


