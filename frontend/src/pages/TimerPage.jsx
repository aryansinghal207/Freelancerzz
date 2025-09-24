import { useEffect, useMemo, useRef, useState } from 'react'
import { getProjects, listSessions, manualLog, startTimer, stopTimer, deleteSession } from '../api'
import dayjs from 'dayjs'

export default function TimerPage() {
  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [sessions, setSessions] = useState([])
  const [running, setRunning] = useState(null)
  const tick = useRef(null)

  async function load() {
    const ps = await getProjects()
    setProjects(ps)
    const sess = await listSessions({ projectId, from: date, to: date })
    setSessions(sess)
    // Detect if there is any session without endTime as running (across date filter)
    const runningCandidates = await listSessions({ projectId })
    const active = runningCandidates.find(s => !s.endTime)
    setRunning(active || null)
  }
  useEffect(() => { load() }, [projectId, date])

  useEffect(() => {
    if (running) {
      tick.current = setInterval(() => setRunning({ ...running }), 1000)
      return () => clearInterval(tick.current)
    }
  }, [running])

  async function handleStart() {
    const ws = await startTimer({ projectId, note })
    setRunning(ws)
    setNote('')
    setSessions(await listSessions({ projectId }))
  }

  async function handleStop() {
    const ws = await stopTimer(running._id)
    setRunning(null)
    setSessions(await listSessions({ projectId }))
  }

  async function handleManual(minsInput) {
    const mins = typeof minsInput === 'number' ? minsInput : Number(prompt('Duration minutes'))
    if (!mins) return
    await manualLog({ projectId, durationMinutes: mins, note })
    setNote('')
    setSessions(await listSessions({ projectId, from: date, to: date }))
  }

  async function remove(s) {
    await deleteSession(s._id)
    setSessions(await listSessions({ projectId }))
  }

  const runningSeconds = useMemo(() => running ? Math.floor((Date.now() - new Date(running.startTime).getTime()) / 1000) : 0, [running])
  function formatSecondsToHMS(totalSeconds) {
    const sec = Math.max(0, Math.floor(totalSeconds || 0))
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const ss = String(s).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }
  function formatMinutesToHMS(totalMinutes) {
    const totalSeconds = Math.round((totalMinutes || 0) * 60)
    return formatSecondsToHMS(totalSeconds)
  }
  function hoursOf(s) { return Number(((s.durationMinutes || 0) / 60).toFixed(3)) }
  function amountOf(s) { return Number((hoursOf(s) * (s.hourlyRate || 0)).toFixed(2)) }
  const summary = useMemo(() => {
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)
    const totalSeconds = Math.round(totalMinutes * 60)
    const totalHours = totalMinutes / 60
    const totalEarnings = sessions.reduce((sum, s) => sum + amountOf(s), 0)
    return { totalMinutes, totalSeconds, totalHours, totalEarnings }
  }, [sessions])

  return (
    <div>
      <h2>Timer</h2>
      <div className="row" style={{ marginBottom: 8 }}>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select project</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <div style={{ marginLeft: 'auto' }}>
          <strong>Today:</strong> {formatSecondsToHMS(summary.totalSeconds)} · ₹{summary.totalEarnings.toFixed(2)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
            {!running && <button disabled={!projectId} onClick={handleStart}>Start</button>}
            {running && (
              <>
                <button onClick={handleStop}>Stop ({formatSecondsToHMS(runningSeconds)})</button>
                <div style={{ color: 'var(--muted)' }}>Running since {dayjs(running.startTime).format('HH:mm')}</div>
              </>
            )}
            <button disabled={!projectId} onClick={() => handleManual()}>Log Manual</button>
          </div>
          {/* quick add buttons removed as requested */}

          <ul style={{ marginTop: 12 }}>
            {sessions.map(s => (
              <li key={s._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{dayjs(s.startTime).format('HH:mm')}{s.endTime ? ` – ${dayjs(s.endTime).format('HH:mm')}` : ''} {s.note||''}</span>
                <span style={{ marginLeft: 'auto' }}>{formatMinutesToHMS((s.durationMinutes||0))} · ₹{amountOf(s).toFixed(2)}</span>
                <button className="danger" onClick={() => remove(s)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            {formatSecondsToHMS(runningSeconds)}
          </div>
          <div style={{ color: 'var(--muted)' }}>
            {running ? `Running on ${projects.find(p => p._id === running.projectId)?.name || 'Project'} ` : 'No active timer'}
          </div>
          <hr style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
          <div className="col">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Total today</span>
              <strong>{formatSecondsToHMS(summary.totalSeconds)}</strong>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span>Earnings</span>
              <strong>₹{summary.totalEarnings.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


