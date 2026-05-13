import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getClientProjects } from '../api'

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      const data = await getClientProjects()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
      alert('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading projects...</div>

  return (
    <div>
      <h1>My Projects</h1>
      
      {projects.length === 0 ? (
        <div>No projects found</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {projects.map(project => (
            <div key={project.id} style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{project.name}</h3>
                  {project.description && (
                    <p style={{ margin: '0 0 8px 0', color: '#666' }}>{project.description}</p>
                  )}
                  <div style={{ fontSize: 14 }}>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: project.status === 'active' ? '#e8f5e9' : '#f5f5f5',
                      color: project.status === 'active' ? '#2e7d32' : '#666'
                    }}>
                      {project.status}
                    </span>
                    {project.hourlyRate && (
                      <span style={{ marginLeft: 12 }}>₹{project.hourlyRate}/hour</span>
                    )}
                  </div>
                </div>
                <Link to={`/client/projects/${project.id}`}>
                  <button>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
