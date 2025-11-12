import { useEffect, useState } from 'react'
import { getClientInvoices } from '../api'

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      setLoading(true)
      const data = await getClientInvoices()
      setInvoices(data)
    } catch (err) {
      console.error('Failed to load invoices:', err)
      alert('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading invoices...</div>

  return (
    <div>
      <h1>My Invoices</h1>
      
      {invoices.length === 0 ? (
        <div>No invoices found</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: 12 }}>Invoice #</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Project</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Issue Date</th>
                <th style={{ textAlign: 'left', padding: 12 }}>Due Date</th>
                <th style={{ textAlign: 'right', padding: 12 }}>Amount</th>
                <th style={{ textAlign: 'center', padding: 12 }}>Status</th>
                <th style={{ textAlign: 'center', padding: 12 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>
                    <strong>{invoice.number}</strong>
                  </td>
                  <td style={{ padding: 12 }}>
                    {invoice.projectId?.name || '-'}
                  </td>
                  <td style={{ padding: 12 }}>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: 12 }}>
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    ₹{invoice.total.toFixed(2)}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <span style={{ 
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      background: 
                        invoice.status === 'paid' ? '#e8f5e9' : 
                        invoice.status === 'overdue' ? '#ffebee' : 
                        invoice.status === 'sent' ? '#e3f2fd' : '#f5f5f5',
                      color: 
                        invoice.status === 'paid' ? '#2e7d32' : 
                        invoice.status === 'overdue' ? '#c62828' : 
                        invoice.status === 'sent' ? '#1565c0' : '#666'
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    {invoice.pdfPath && (
                      <a 
                        href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${invoice.pdfPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button>View PDF</button>
                      </a>
                    )}
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
