import { useEffect, useState } from 'react'
import { getClientTimeReport, getClientProjects } from '../api'
import dayjs from 'dayjs'

export default function ClientTimeReportPage() {
  const [report, setReport] = useState(null)
  const [projects, setProjects] = useState([])
  const [filters, setFilters] = useState({
    projectId: '',
    startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD')
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    loadReport()
  }, [filters])

  async function loadProjects() {
    try {
      const data = await getClientProjects()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
    }
  }

  async function loadReport() {
    try {
      setLoading(true)
      const data = await getClientTimeReport(filters)
      setReport(data)
    } catch (err) {
      console.error('Failed to load report:', err)
      alert('Failed to load time report')
    } finally {
      setLoading(false)
    }
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading && !report) return <div>Loading report...</div>

  return (
    <div>
      <h1>Time Tracking Report</h1>
      
      <div style={{ marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <label>
              <div style={{ marginBottom: 4, fontSize: 14 }}>Project</div>
              <select 
                value={filters.projectId} 
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
                style={{ padding: 8, minWidth: 200 }}
              >
                <option value="">All Projects</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>{proj.name}</option>
                ))}
              </select>
            </label>
          </div>
          
          <div>
            <label>
              <div style={{ marginBottom: 4, fontSize: 14 }}>Start Date</div>
              <input 
                type="date" 
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                style={{ padding: 8 }}
              />
            </label>
          </div>
          
          <div>
            <label>
              <div style={{ marginBottom: 4, fontSize: 14 }}>End Date</div>
              <input 
                type="date" 
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                style={{ padding: 8 }}
              />
            </label>
          </div>
        </div>
      </div>

      {report && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
              <h3>Total Sessions</h3>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{report.totalSessions}</div>
            </div>
            
            <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
              <h3>Total Hours</h3>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{report.totalHours}</div>
            </div>
          </div>

          <h2>By Project</h2>
          {report.byProject.length === 0 ? (
            <div>No time logged in this period</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {report.byProject.map(proj => (
                <div key={proj.projectId} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>{proj.projectName}</h3>
                    <div style={{ fontSize: 18, fontWeight: 'bold' }}>{proj.totalHours}h</div>
                  </div>
                  <div style={{ fontSize: 14, color: '#666' }}>
                    {proj.sessions.length} sessions logged
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2>All Sessions</h2>
          {report.sessions.length === 0 ? (
            <div>No sessions found</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Project</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Task</th>
                    <th style={{ textAlign: 'right', padding: 8 }}>Duration</th>
                    <th style={{ textAlign: 'left', padding: 8 }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {report.sessions.map(session => (
                    <tr key={session.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: 8 }}>
                        {new Date(session.startTime).toLocaleDateString()}
                      </td>
                      <td style={{ padding: 8 }}>
                        {session.projectId?.name || '-'}
                      </td>
                      <td style={{ padding: 8 }}>
                        {session.taskId?.title || '-'}
                      </td>
                      <td style={{ padding: 8, textAlign: 'right' }}>
                        {((session.durationMinutes || 0) / 60).toFixed(2)}h
                      </td>
                      <td style={{ padding: 8 }}>
                        {session.note || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
