import { useEffect, useState } from 'react'
import { getClients, createProject, deleteProject, getProjects, updateProject } from '../api'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ clientId: '', name: '', description: '', hourlyRate: '' })
  const [expandedId, setExpandedId] = useState('')

  async function load() {
    const cs = await getClients()
    setClients(cs)
    const ps = await getProjects()
    setProjects(ps)
  }
  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    await createProject({ ...form, hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined })
    setForm({ clientId: '', name: '', description: '', hourlyRate: '' })
    load()
  }

  async function edit(p) {
    const name = prompt('Name', p.name)
    if (name == null) return
    const description = prompt('Description', p.description || '')
    if (description === null) return
    const rateStr = prompt('Hourly Rate (blank to inherit)', p.hourlyRate ? String(p.hourlyRate) : '')
    if (rateStr === null) return
    const hourlyRate = rateStr ? Number(rateStr) : undefined
    await updateProject(p._id, { ...p, name, description, hourlyRate })
    load()
  }

  async function remove(p) {
    if (!confirm('Delete project?')) return
    await deleteProject(p._id)
    load()
  }

  function clientNameOf(p) {
    const c = clients.find(c => c._id === p.clientId)
    return c ? c.name : '—'
  }

  return (
    <div>
      <h2>Projects</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <select value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} required>
          <option value="">Select client</option>
          {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Hourly Rate (optional)" type="number" value={form.hourlyRate} onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
        <button>Add Project</button>
      </form>
      <ul>
        {projects.map(p => (
          <li key={p._id}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{p.name}</span>
              <button className="secondary" onClick={() => setExpandedId(expandedId === p._id ? '' : p._id)}>{expandedId === p._id ? 'Hide' : 'View'}</button>
              <button onClick={() => edit(p)}>Edit</button>
              <button className="danger" onClick={() => remove(p)}>Delete</button>
            </div>
            {expandedId === p._id && (
              <div style={{ marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
                  <div><strong>Client:</strong> {clientNameOf(p)}</div>
                  <div><strong>Rate:</strong> {p.hourlyRate ? `₹${Number(p.hourlyRate).toFixed(2)}` : '—'}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Description:</strong> {p.description || '-'}</div>
                  <div><strong>Status:</strong> {p.status}</div>
                  <div><strong>Created:</strong> {new Date(p.createdAt).toLocaleString()}</div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}


