import dayjs from 'dayjs';
import WorkSession from '../models/WorkSession.js';

export async function summary(req, res) {
  const { from, to } = req.query;
  const filter = { userId: req.user.id };
  if (from || to) {
    filter.startTime = {};
    if (from) filter.startTime.$gte = dayjs(from).toDate();
    if (to) filter.startTime.$lte = dayjs(to).toDate();
  }
  const sessions = await WorkSession.find(filter);
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const totalHours = totalMinutes / 60;
  const totalEarnings = sessions.reduce((sum, s) => sum + ((s.durationMinutes || 0) / 60) * (s.hourlyRate || 0), 0);
  res.json({ totalHours, totalEarnings });
}

export async function groupByPeriod(req, res) {
  const { period = 'day', from, to } = req.query; // day|week|month
  const start = from ? dayjs(from) : dayjs().startOf('year');
  const end = to ? dayjs(to) : dayjs();
  const sessions = await WorkSession.find({
    userId: req.user.id,
    startTime: { $gte: start.toDate(), $lte: end.toDate() },
  });

  const buckets = {};
  for (const s of sessions) {
    let key;
    if (period === 'week') key = dayjs(s.startTime).startOf('week').format('YYYY-[W]WW');
    else if (period === 'month') key = dayjs(s.startTime).startOf('month').format('YYYY-MM');
    else key = dayjs(s.startTime).format('YYYY-MM-DD');
    const hours = (s.durationMinutes || 0) / 60;
    const earnings = hours * (s.hourlyRate || 0);
    if (!buckets[key]) buckets[key] = { hours: 0, earnings: 0 };
    buckets[key].hours += hours;
    buckets[key].earnings += earnings;
  }
  res.json(buckets);
}


