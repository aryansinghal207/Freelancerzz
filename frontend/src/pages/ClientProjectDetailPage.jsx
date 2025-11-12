import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getClientProject, getClientProjectTasks, getClientWorkSessions } from '../api'

export default function ClientProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjectData()
  }, [id])

  async function loadProjectData() {
    try {
      setLoading(true)
      const [projectData, tasksData, sessionsData] = await Promise.all([
        getClientProject(id),
        getClientProjectTasks(id),
        getClientWorkSessions({ projectId: id })
      ])
      setProject(projectData)
      setTasks(tasksData)
      setSessions(sessionsData)
    } catch (err) {
      console.error('Failed to load project:', err)
      alert('Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading project details...</div>
  if (!project) return <div>Project not found</div>

  const totalHours = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60

  return (
    <div>
      <h1>{project.name}</h1>
      
      <div style={{ marginBottom: 24 }}>
        {project.description && <p>{project.description}</p>}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div>
            <strong>Status:</strong>{' '}
            <span style={{ textTransform: 'capitalize' }}>{project.status}</span>
          </div>
          {project.hourlyRate && (
            <div>
              <strong>Hourly Rate:</strong> ₹{project.hourlyRate}
            </div>
          )}
          <div>
            <strong>Total Hours:</strong> {totalHours.toFixed(2)}
          </div>
        </div>
      </div>

      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <div>No tasks yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {tasks.map(task => (
            <div key={task._id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{task.title}</strong>
                  {task.description && <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{task.description}</div>}
                </div>
                <span style={{ 
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  background: task.status === 'done' ? '#e8f5e9' : task.status === 'in_progress' ? '#fff3e0' : '#f5f5f5',
                  color: task.status === 'done' ? '#2e7d32' : task.status === 'in_progress' ? '#e65100' : '#666'
                }}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2>Work Sessions</h2>
      {sessions.length === 0 ? (
        <div>No work sessions recorded yet</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Task</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Duration</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>
                    {new Date(session.startTime).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 8 }}>
                    {session.taskId?.title || '-'}
                  </td>
                  <td style={{ padding: 8 }}>
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
    </div>
  )
}
