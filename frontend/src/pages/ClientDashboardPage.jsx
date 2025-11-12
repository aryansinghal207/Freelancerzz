import { useEffect, useState } from 'react'
import { getClientDashboard } from '../api'

export default function ClientDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      const data = await getClientDashboard()
      setDashboard(data)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      alert('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div>
      <h1>My Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Projects</h3>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{dashboard?.activeProjects || 0}</div>
          <div style={{ fontSize: 14, color: '#666' }}>Active / {dashboard?.totalProjects || 0} Total</div>
        </div>
        
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Tasks</h3>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{dashboard?.completedTasks || 0}</div>
          <div style={{ fontSize: 14, color: '#666' }}>Completed / {dashboard?.totalTasks || 0} Total</div>
        </div>
        
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Total Hours</h3>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{dashboard?.totalHours || 0}</div>
          <div style={{ fontSize: 14, color: '#666' }}>Hours Logged</div>
        </div>
        
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Total Invoiced</h3>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>₹{dashboard?.totalInvoiced || 0}</div>
          <div style={{ fontSize: 14, color: '#666' }}>₹{dashboard?.pendingAmount || 0} Pending</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h2>Recent Projects</h2>
          {dashboard?.recentProjects?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dashboard.recentProjects.map(project => (
                <div key={project._id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
                  <div style={{ fontWeight: 'bold' }}>{project.name}</div>
                  <div style={{ fontSize: 14, color: '#666' }}>
                    Status: <span style={{ textTransform: 'capitalize' }}>{project.status}</span>
                  </div>
                  {project.description && (
                    <div style={{ fontSize: 14, marginTop: 4 }}>{project.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No projects yet</div>
          )}
        </div>

        <div>
          <h2>Recent Invoices</h2>
          {dashboard?.recentInvoices?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dashboard.recentInvoices.map(invoice => (
                <div key={invoice._id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
                  <div style={{ fontWeight: 'bold' }}>Invoice #{invoice.number}</div>
                  <div style={{ fontSize: 14, color: '#666' }}>
                    Amount: ₹{invoice.total} | Status: <span style={{ textTransform: 'capitalize' }}>{invoice.status}</span>
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No invoices yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
