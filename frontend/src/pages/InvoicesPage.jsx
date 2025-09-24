import { useEffect, useMemo, useState } from 'react'
import { createInvoiceFromRange, getProjects, listInvoices, deleteInvoice } from '../api'

export default function InvoicesPage() {
  const [projects, setProjects] = useState([])
  const [invoices, setInvoices] = useState([])
  const [projectId, setProjectId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  function formatHoursToHMS(hours) {
    const seconds = Math.round((hours || 0) * 3600)
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const hh = String(h).padStart(2, '0')
    const mm = String(m).padStart(2, '0')
    const ss = String(s).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }

  async function load() {
    setProjects(await getProjects())
    setInvoices(await listInvoices())
  }
  useEffect(() => { load() }, [])

  async function createInv() {
    await createInvoiceFromRange({ projectId, from, to })
    setInvoices(await listInvoices())
  }

  function openPdf(inv) {
    if (inv.pdfPath) {
      // pdfPath is an absolute server path; we expose /invoices statically on the API
      const fileName = inv.number + '.pdf'
      const url = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api','') + '/invoices/' + fileName
      window.open(url, '_blank')
    }
  }

  return (
    <div>
      <h2>Invoices</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select project</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button disabled={!projectId} onClick={createInv}>Create from Range</button>
      </div>
      <ul style={{ marginTop: 12 }}>
        {invoices.map(inv => (
          <li key={inv._id}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{inv.number} - ₹{inv.total} {inv.currency}</span>
              <button onClick={() => openPdf(inv)}>Open PDF</button>
              <button className="danger" onClick={async () => { await deleteInvoice(inv._id); setInvoices(await listInvoices()) }}>Delete</button>
            </div>
            <div style={{ color: 'var(--muted)' }}>
              Total Time: {formatHoursToHMS((inv.items || []).reduce((sum,i)=>sum + (i.hours||0),0))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}


