import { useEffect, useState } from 'react'
import { getGrouped, getSummary } from '../api'

export default function ReportsPage() {
  const [summary, setSummary] = useState({ totalHours: 0, totalEarnings: 0 })
  const [grouped, setGrouped] = useState({})
  const [period, setPeriod] = useState('month')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  async function load() {
    setSummary(await getSummary({ from, to }))
    setGrouped(await getGrouped({ period, from, to }))
  }
  useEffect(() => { load() }, [period, from, to])

  return (
    <div>
      <h2>Reports</h2>
      <div className="row" style={{ gap: 8, marginBottom: 8 }}>
        <select value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button className="secondary" onClick={() => { setFrom(''); setTo(''); }}>Clear</button>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
          <div><strong>Total Hours</strong></div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{summary.totalHours.toFixed(3)}h</div>
        </div>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
          <div><strong>Total Earnings</strong></div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>₹{summary.totalEarnings.toFixed(2)}</div>
        </div>
      </div>
      <h3 style={{ marginTop: 12 }}>By {period.charAt(0).toUpperCase() + period.slice(1)}</h3>
      <ul>
        {Object.entries(grouped).map(([k, v]) => (
          <li key={k}>{k}: {v.hours.toFixed(3)}h, ₹{v.earnings.toFixed(2)}</li>
        ))}
        {Object.keys(grouped).length === 0 && (<li className="empty">No data for selected range.</li>)}
      </ul>
    </div>
  )
}


