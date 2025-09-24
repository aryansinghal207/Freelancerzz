import { useEffect, useMemo, useState } from 'react'
import { getDaily, getMonthly, getWeekly } from '../api'
import dayjs from 'dayjs'

export default function CalendarPage() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [view, setView] = useState('daily')
  const [sessions, setSessions] = useState([])

  async function load() {
    if (view === 'daily') setSessions(await getDaily(date))
    if (view === 'weekly') setSessions(await getWeekly(date))
    if (view === 'monthly') setSessions(await getMonthly(date))
  }
  useEffect(() => { load() }, [date, view])

  function prev() {
    const d = dayjs(date)
    if (view === 'daily') setDate(d.subtract(1, 'day').format('YYYY-MM-DD'))
    if (view === 'weekly') setDate(d.subtract(1, 'week').format('YYYY-MM-DD'))
    if (view === 'monthly') setDate(d.subtract(1, 'month').format('YYYY-MM-DD'))
  }
  function next() {
    const d = dayjs(date)
    if (view === 'daily') setDate(d.add(1, 'day').format('YYYY-MM-DD'))
    if (view === 'weekly') setDate(d.add(1, 'week').format('YYYY-MM-DD'))
    if (view === 'monthly') setDate(d.add(1, 'month').format('YYYY-MM-DD'))
  }
  function today() {
    setDate(dayjs().format('YYYY-MM-DD'))
  }

  function hoursOf(s) {
    return Number(((s.durationMinutes || 0) / 60).toFixed(3))
  }
  function amountOf(s) {
    return Number((hoursOf(s) * (s.hourlyRate || 0)).toFixed(2))
  }

  const summary = useMemo(() => {
    const totalHours = sessions.reduce((sum, s) => sum + hoursOf(s), 0)
    const totalEarnings = sessions.reduce((sum, s) => sum + amountOf(s), 0)
    return { totalHours, totalEarnings }
  }, [sessions])

  const grouped = useMemo(() => {
    if (view === 'daily') return null
    const bucket = {}
    for (const s of sessions) {
      const key = dayjs(s.startTime).format('YYYY-MM-DD')
      if (!bucket[key]) bucket[key] = { hours: 0, earnings: 0, items: [] }
      bucket[key].hours += hoursOf(s)
      bucket[key].earnings += amountOf(s)
      bucket[key].items.push(s)
    }
    return bucket
  }, [sessions, view])

  return (
    <div>
      <h2>Calendar</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <button className="secondary" onClick={prev}>◀ Prev</button>
        <button className="secondary" onClick={today}>Today</button>
        <button className="secondary" onClick={next}>Next ▶</button>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <select value={view} onChange={e => setView(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <strong>{view.toUpperCase()}:</strong> {summary.totalHours.toFixed(3)}h, ₹{summary.totalEarnings.toFixed(2)}
        </div>
      </div>

      {view === 'daily' && (
        <ul>
          {sessions.map(s => (
            <li key={s._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{dayjs(s.startTime).format('HH:mm')}{s.endTime ? ` – ${dayjs(s.endTime).format('HH:mm')}` : ''}</span>
              <span style={{ color: '#9ca3af' }}>{s.note || ''}</span>
              <span style={{ marginLeft: 'auto' }}>{hoursOf(s).toFixed(3)}h · ₹{amountOf(s).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}

      {view !== 'daily' && (
        <div className="col">
          {Object.entries(grouped || {}).sort((a,b) => a[0] < b[0] ? 1 : -1).map(([day, data]) => (
            <div key={day} style={{ padding: 8, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--panel)' }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{day} ({data.items.length} logs)</strong>
                <span>{data.hours.toFixed(3)}h · ₹{data.earnings.toFixed(2)}</span>
              </div>
              <ul className="list">
                {data.items.map(s => (
                  <li key={s._id}>
                    <span>{dayjs(s.startTime).format('HH:mm')}{s.endTime ? ` – ${dayjs(s.endTime).format('HH:mm')}` : ''} {s.note || ''}</span>
                    <span>{hoursOf(s).toFixed(3)}h · ₹{amountOf(s).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


