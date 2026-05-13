import { useEffect, useState } from 'react'
import { getClientDashboard, markAllInvoicesPaid } from '../api'
import PaymentModal from '../components/PaymentModal'

export default function ClientDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      const data = await getClientDashboard()
      console.log('Dashboard data received:', data)
      setDashboard(data)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      const errorMsg = err.response?.data?.message || 'Failed to load dashboard'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  async function handleMarkPaid() {
    await markAllInvoicesPaid()
    await loadDashboard()
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
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>{(dashboard?.totalHours || 0).toFixed(2)}</div>
          <div style={{ fontSize: 14, color: '#666' }}>Hours Logged</div>
        </div>
        
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Total Invoiced</h3>
          <div style={{ fontSize: 24, fontWeight: 'bold' }}>₹{(dashboard?.totalInvoiced || 0).toFixed(2)}</div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>₹{(dashboard?.pendingAmount || 0).toFixed(2)} Pending</div>
          {dashboard?.pendingAmount > 0 && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              💳 Pay Now
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h2>Recent Projects</h2>
          {dashboard?.recentProjects?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dashboard.recentProjects.map(project => (
                <div key={project.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
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
                <div key={invoice.id} style={{ padding: 12, border: '1px solid #ddd', borderRadius: 4 }}>
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

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onMarkPaid={handleMarkPaid}
        totalAmount={dashboard?.totalInvoiced || 0}
        pendingAmount={dashboard?.pendingAmount || 0}
      />
    </div>
  )
}
