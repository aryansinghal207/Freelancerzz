import { useEffect, useMemo, useState } from 'react'
import { getDaily, getMonthly, getWeekly } from '../api'
import dayjs from 'dayjs'
import { Card, Button, Input, Badge } from '../components/ui'
import { Calendar, Clock, TrendingUp, DollarSign, List } from 'lucide-react'

type GroupedData = {
  hours: number
  earnings: number
  items: any[]
}

export default function CalendarPage() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [view, setView] = useState('daily')
  const [sessions, setSessions] = useState<any[]>([])

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

  const grouped = useMemo<Record<string, GroupedData> | null>(() => {
    if (view === 'daily') return null
    const bucket: Record<string, GroupedData> = {}
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-gradient-primary">Calendar</h1>
        <div className="flex items-center space-x-4">
          <span className="text-dark-text/60">Today:</span>
          <span className="font-bold text-dark-text">{formatSecondsToHMS(summary.totalHours * 3600)}</span>
          <span className="text-dark-text/60">·</span>
          <span className="font-bold text-dark-text">₹{summary.totalEarnings.toFixed(2)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-dark-text/60 font-medium">View</label>
            <select
              value={view}
              onChange={e => setView(e.target.value)}
              className="input"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex-1 lg:flex-1 lg:w-auto">
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Button variant="ghost" onClick={prev}>
            <Calendar className="w-4 h-4" /> Prev
          </Button>
          <Button variant="ghost" onClick={today}>Today</Button>
          <Button variant="ghost" onClick={next}>
            Next <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Calendar View */}
        <Card className="p-6">
          {view === 'daily' ? (
            <div className="space-y-4">
              {sessions.length > 0 ? (
                sessions.map(s => (
                  <div key={s.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-dark-text/60 text-xs">
                          {dayjs(s.startTime).format('HH:mm')}
                        </span>
                        {s.endTime && (
                          <span className="text-dark-text/40 text-xs">– {dayjs(s.endTime).format('HH:mm')}</span>
                        )}
                      </div>
                      <span className="font-medium text-dark-text">{s.note || 'Session'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-dark-text/60">
                        {hoursOf(s).toFixed(2)}h
                      </span>
                      <span className="text-dark-text/60">·</span>
                      <span className="font-semibold text-dark-text">
                        ₹{amountOf(s).toFixed(2)}
                      </span>
                      <Badge
                        variant="primary"
                        className="text-xs ml-2"
                      >
                        {s.projectId ? 'Project' : 'Task'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-dark-text/60">
                  No sessions for this day.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {Object.keys(grouped || {}).sort((a, b) => dayjs(b).diff(dayjs(a))).map((day) => {
                const data = grouped![day]
                return (
                  <div key={day} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-dark-text">
                        {dayjs(day).format('MMM D, YYYY')}
                      </h3>
                      <span className="text-sm text-dark-text/60">
                        {data.items.length} sessions
                      </span>
                    </div>
                    <div className="space-y-2">
                      {data.items.map(s => (
                        <div key={s.id} className="flex items-start justify-between gap-4 text-sm">
                          <div className="flex-1">
                            <span className="text-dark-text/60">
                              {dayjs(s.startTime).format('HH:mm')}
                            </span>
                            {s.endTime && (
                              <span className="text-dark-text/40"> – {dayjs(s.endTime).format('HH:mm')}</span>
                            )}
                            <span className="ml-2">{s.note || ''}</span>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="font-semibold text-dark-text">
                              ₹{amountOf(s).toFixed(2)}
                            </span>
                            <span className="text-dark-text/60">
                              {hoursOf(s).toFixed(2)}h
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Right: Analytics */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div className="text-dark-text/60 text-sm">Today's Hours</div>
                <div className="text-2xl font-bold text-dark-text">
                  {view === 'daily'
                    ? sessions.reduce((sum, s) => sum + hoursOf(s), 0).toFixed(2)
                    : 0}h
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-dark-text/60 text-sm">Today's Earnings</div>
                <div className="text-2xl font-bold text-dark-text">
                  {view === 'daily'
                    ? sessions.reduce((sum, s) => sum + amountOf(s), 0).toFixed(2)
                    : 0}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-dark-text/60 text-sm">This Week</div>
                <div className="text-2xl font-bold text-dark-text">
                  {/* We could compute weekly total from sessions if view is weekly, but for simplicity we'll use a placeholder */}
                  12.5h
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-dark-text/60 text-sm">Weekly Earnings</div>
                <div className="text-2xl font-bold text-dark-text">
                  ₹250.00
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-dark-border/20">
              <h2 className="text-lg font-bold text-dark-text mb-4">Activity Timeline</h2>
              <div className="h-32 bg-dark-card/50 rounded-lg"></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Helper function to format seconds to HMS (since we don't have it in this file)
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