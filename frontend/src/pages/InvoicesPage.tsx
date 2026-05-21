import { useEffect, useState } from 'react'
import { createInvoiceFromRange, getProjects, listInvoices, deleteInvoice } from '../api'
import { Button, Input } from '../components/ui'

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
      <h2 className="mb-4 text-2xl font-bold text-gradient-primary">Invoices</h2>
      <div className="space-y-4">
        <select className="input w-full" value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">Select project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <Button onClick={createInv} disabled={!projectId}>
          Create from Range
        </Button>
      </div>
      <ul className="mt-4 space-y-4">
        {invoices.map(inv => (
          <li key={inv.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="font-medium text-dark-text">{inv.number} - ₹{inv.total} {inv.currency}</span>
                <div className="text-sm text-dark-text/60">
                  Total Time: {formatHoursToHMS((inv.items || []).reduce((sum,i)=>sum + (i.hours||0),0))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => openPdf(inv)} variant="ghost" size="sm">
                  Open PDF
                </Button>
                <Button
                  onClick={async () => { await deleteInvoice(inv.id); setInvoices(await listInvoices()) }}
                  variant="danger"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}


