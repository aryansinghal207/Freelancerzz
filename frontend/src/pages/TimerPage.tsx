import { useEffect, useMemo, useRef, useState } from 'react'
import { getProjects, listSessions, manualLog, startTimer, stopTimer, deleteSession } from '../api'
import dayjs from 'dayjs'
import { Card, Button, Input, Badge } from '../components/ui'
import { Timer, TrendingUp, DollarSign, List } from 'lucide-react'

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
    const _ws = await stopTimer(running.id)
    setRunning(null)
    setSessions(await listSessions({ projectId }))
  }

  async function handleManual(minsInput?: number) {
    const mins = typeof minsInput === 'number' ? minsInput : Number(prompt('Duration minutes'))
    if (!mins) return
    await manualLog({ projectId, durationMinutes: mins, note })
    setNote('')
    setSessions(await listSessions({ projectId, from: date, to: date }))
  }

  async function remove(s) {
    await deleteSession(s.id)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-gradient-primary">Timer</h1>
        <div className="flex items-center space-x-4">
          <span className="text-dark-text/60">Today:</span>
          <span className="font-bold text-dark-text">{formatSecondsToHMS(summary.totalSeconds)}</span>
          <span className="text-dark-text/60">·</span>
          <span className="font-bold text-dark-text">₹{summary.totalEarnings.toFixed(2)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Controls */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Project Selector */}
            <div className="space-y-2">
              <label className="text-dark-text/60 font-medium">Project</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="input w-full"
              >
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Notes Input */}
            <div className="space-y-2">
              <label className="text-dark-text/60 font-medium">Note (optional)</label>
              <Input
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note about this session"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row gap-3">
              {!running && (
                <Button
                  variant="primary"
                  onClick={handleStart}
                  disabled={!projectId}
                  className="flex-1"
                >
                  Start Timer
                </Button>
              )}
              {running && (
                <>
                  <Button
                    variant="danger"
                    onClick={handleStop}
                    className="flex-1"
                  >
                    Stop Timer
                  </Button>
                  <div className="flex flex-col items-center text-xs text-dark-text/60">
                    Running since {dayjs(running.startTime).format('HH:mm')}
                  </div>
                </>
              )}
              <Button
                variant="ghost"
                onClick={() => handleManual()}
                disabled={!projectId}
                className="flex-1"
              >
                Log Manual
              </Button>
            </div>
          </div>
        </Card>

        {/* Right Column: Timer Display and Stats */}
        <Card className="p-6">
          <div className="space-y-6">
            {/* Live Timer */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2">
                <Timer className="w-8 h-8 text-primary-400" />
                <h1 className="text-5xl font-bold text-dark-text tracking-tight">
                  {formatSecondsToHMS(runningSeconds)}
                </h1>
              </div>
              {running && (
                <p className="mt-2 text-dark-text/60">
                  Running on {projects.find(p => p.id === running.projectId)?.name || 'Project'}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-dark-text/60 text-sm">Today's Work</div>
                <div className="text-2xl font-bold text-dark-text">
                  {formatSecondsToHMS(summary.totalSeconds)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-dark-text/60 text-sm">Today's Earnings</div>
                <div className="text-2xl font-bold text-dark-text">
                  ₹{summary.totalEarnings.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-dark-text/60 text-sm">This Week</div>
                <div className="text-2xl font-bold text-dark-text">
                  12h 30m
                </div>
              </div>
              <div className="text-center">
                <div className="text-dark-text/60 text-sm">Weekly Earnings</div>
                <div className="text-2xl font-bold text-dark-text">
                  ₹2,450.00
                </div>
              </div>
            </div>

            {/* Weekly Chart Placeholder */}
            <div className="pt-4 border-t border-dark-border/20">
              <h2 className="text-lg font-bold text-dark-text mb-4">Weekly Productivity</h2>
              <div className="h-32 bg-dark-card/50 rounded-lg"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Session Log */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <h2 className="text-xl font-bold text-dark-text">Session Log</h2>
          <Button variant="ghost" onClick={() => {}}>Clear Log</Button>
        </div>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-text/60 text-xs">
                      {dayjs(s.startTime).format('HH:mm')}
                    </span>
                    {s.endTime && (
                      <span className="text-dark-text/40 text-xs">– {dayjs(s.endTime).format('HH:mm')}</span>
                    )}
                  </div>
                  {s.note && (
                    <p className="text-dark-text/60 text-sm">{s.note}</p>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <span className="font-semibold text-dark-text">
                    {formatMinutesToHMS((s.durationMinutes||0))}
                  </span>
                  <span className="text-dark-text/60">· ₹{amountOf(s).toFixed(2)}</span>
                  <button
                    onClick={() => remove(s)}
                    className="text-xs text-danger hover:text-danger/80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-text/60">
            No sessions logged yet
          </div>
        )}
      </Card>
    </div>
  )
}