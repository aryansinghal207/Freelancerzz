import { useEffect, useState } from 'react'
import { createClient, deleteClient, getClients, updateClient, getProjects } from '../api'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', defaultHourlyRate: '' })
  const [expandedId, setExpandedId] = useState('')
  const [clientProjects, setClientProjects] = useState({})

  async function load() {
    setClients(await getClients())
  }
  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    await createClient(form)
    setForm({ name: '', email: '', phone: '', address: '', defaultHourlyRate: '' })
    load()
  }

  async function edit(c) {
    const name = prompt('Name', c.name)
    if (name == null) return
    const email = prompt('Email', c.email || '')
    if (email === null) return
    const phone = prompt('Phone', c.phone || '')
    if (phone === null) return
    const address = prompt('Address', c.address || '')
    if (address === null) return
    const rateStr = prompt('Default Hourly Rate', String(c.defaultHourlyRate || ''))
    if (rateStr === null) return
    const defaultHourlyRate = rateStr ? Number(rateStr) : undefined
    await updateClient(c._id, { ...c, name, email, phone, address, defaultHourlyRate })
    load()
  }

  async function remove(c) {
    if (!confirm('Delete client?')) return
    await deleteClient(c._id)
    load()
  }

  async function toggleView(c) {
    if (expandedId === c._id) { setExpandedId(''); return }
    setExpandedId(c._id)
    if (!clientProjects[c._id]) {
      const projects = await getProjects(c._id)
      setClientProjects(prev => ({ ...prev, [c._id]: projects }))
    }
  }

  return (
    <div>
      <h2>Clients</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Default Rate" type="number" value={form.defaultHourlyRate} onChange={e => setForm({ ...form, defaultHourlyRate: Number(e.target.value) })} />
        <button>Add Client</button>
      </form>
      <ul>
        {clients.length === 0 && (
          <li className="empty">No clients yet. Add your first client using the form above.</li>
        )}
        {clients.map(c => (
          <li key={c._id}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{c.name} {c.email ? `- ${c.email}` : ''}</span>
              <button className="secondary" onClick={() => toggleView(c)}>{expandedId === c._id ? 'Hide' : 'View'}</button>
              <button onClick={() => edit(c)}>Edit</button>
              <button className="danger" onClick={() => remove(c)}>Delete</button>
            </div>
            {expandedId === c._id && (
              <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
                  <div><strong>Email:</strong> {c.email || '-'}</div>
                  <div><strong>Phone:</strong> {c.phone || '-'}</div>
                  <div><strong>Address:</strong> {c.address || '-'}</div>
                  <div><strong>Default Rate:</strong> ₹{Number(c.defaultHourlyRate || 0).toFixed(2)}</div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Projects</strong>
                  <ul className="list">
                    {(clientProjects[c._id] || []).map(p => (
                      <li key={p._id}>
                        <span>{p.name}</span>
                        <span>{p.hourlyRate ? `₹${p.hourlyRate}` : '—'}</span>
                      </li>
                    ))}
                    {(!clientProjects[c._id] || clientProjects[c._id].length === 0) && (
                      <li><span style={{ color: 'var(--muted)' }}>No projects</span></li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}


