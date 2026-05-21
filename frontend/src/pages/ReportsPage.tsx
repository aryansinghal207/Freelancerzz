import { useEffect, useState } from 'react'
import { getGrouped, getSummary } from '../api'
import { Card, Button, Input } from '../components/ui'
import { TrendingUp, DollarSign, Calendar, Clock } from 'lucide-react'

import Badge from "../components/ui/Badge"



export default function ReportsPage() {
  const [summary, setSummary] = useState({ totalHours: 0, totalEarnings: 0 })
  const [grouped, setGrouped] = useState<Record<string, { hours: number; earnings: number }>>({})
  const [period, setPeriod] = useState('month')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  async function load() {
    setSummary(await getSummary({ from, to }))
    setGrouped(await getGrouped({ period, from, to }))
  }
  useEffect(() => { load() }, [period, from, to])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-gradient-primary">Reports</h1>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-dark-text/60 font-medium">Period</label>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="input"
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="flex-1 lg:flex-1 lg:w-auto">
            <Input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              placeholder="From"
              className="w-full"
            />
          </div>
          <div className="flex-1 lg:flex-1 lg:w-auto">
            <Input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="To"
              className="w-full"
            />
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setFrom('')
              setTo('')
            }}
            className="lg:w-auto"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col items-center">
            <div className="text-dark-text/60 text-sm">Total Hours</div>
            <div className="text-3xl font-bold text-dark-text">
              {summary.totalHours.toFixed(2)}h
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center">
            <div className="text-dark-text/60 text-sm">Total Earnings</div>
            <div className="text-3xl font-bold text-dark-text">
              ₹{summary.totalEarnings.toFixed(2)}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col items-center">
            <div className="text-dark-text/60 text-sm">Average Hourly Rate</div>
            <div className="text-3xl font-bold text-dark-text">
              {summary.totalHours > 0 ? (summary.totalEarnings / summary.totalHours).toFixed(2) : 0}
            </div>
          </div>
        </Card>
      </div>

       {/* Breakdown Section */}
       <Card>
         <div className="space-y-4">
           <h2 className="text-xl font-bold text-dark-text">
             Breakdown by {period.charAt(0).toUpperCase() + period.slice(1)}
           </h2>
           {Object.keys(grouped).length > 0 ? (
             <div className="space-y-3">
               {Object.entries(grouped).map(([key, value]) => (
                 <div key={key} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                   <div className="flex flex-col space-y-1">
                     <span className="font-medium text-dark-text">{key}</span>
                     <span className="text-dark-text/60 text-sm">
                       {value.hours.toFixed(2)}h · ₹{value.earnings.toFixed(2)}
                     </span>
                   </div>
                   <div className="text-right">
                     <Badge variant="primary" className="text-xs px-3 py-1">
                       {value.hours.toFixed(1)}h
                     </Badge>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-center py-8 text-dark-text/60">
               No data for selected range.
             </div>
           )}
         </div>
       </Card>
      </div>
  )
}