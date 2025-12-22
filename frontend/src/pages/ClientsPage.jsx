import { useEffect, useState } from 'react'
import { createClient, deleteClient, getClients, updateClient, getProjects, inviteClient } from '../api'
import MessageModal from '../components/MessageModal'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    defaultHourlyRate: '',
    projectName: '',
    projectDescription: '',
    projectDeadline: ''
  })
  const [expandedId, setExpandedId] = useState('')
  const [clientProjects, setClientProjects] = useState({})
  const [messageModal, setMessageModal] = useState(null)

  async function load() {
    setClients(await getClients())
  }
  useEffect(() => { load() }, [])

  async function submit(e) {
    e.preventDefault()
    
    const clientData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      defaultHourlyRate: form.defaultHourlyRate || 0,
      projectName: form.projectName,
      projectDescription: form.projectDescription,
      projectDeadline: form.projectDeadline
    }
    
    await createClient(clientData)
    setForm({ 
      name: '', 
      email: '', 
      phone: '', 
      address: '', 
      defaultHourlyRate: '',
      projectName: '',
      projectDescription: '',
      projectDeadline: ''
    })
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

  async function inviteClientUser(c) {
    const email = prompt('Enter client email for portal access:', c.email || '')
    if (!email) return
    const name = prompt('Enter client name:', c.name || '')
    if (!name) return
    
    try {
      const result = await inviteClient({ clientId: c._id, email, name })
      if (result.emailError) {
        // Email failed but user created
        alert(`Client invited successfully!\n\n⚠️ Email delivery failed. Please share these credentials manually:\n\nEmail: ${result.clientUser.email}\nPassword: ${result.clientUser.tempPassword}`)
      } else {
        // Email sent successfully
        alert(`✅ Client invited successfully!\n\nCredentials have been sent to ${email}.\nThe client will receive an email with their login details.`)
      }
    } catch (err) {
      alert('Failed to invite client: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div>
      <h2>Clients</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="Client Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Hourly Rate" type="number" value={form.defaultHourlyRate} onChange={e => setForm({ ...form, defaultHourlyRate: Number(e.target.value) })} />
        <input placeholder="Project Name" value={form.projectName} onChange={e => setForm({ ...form, projectName: e.target.value })} required />
        <textarea 
          placeholder="Project Description" 
          value={form.projectDescription} 
          onChange={e => setForm({ ...form, projectDescription: e.target.value })}
          rows={3}
          required
        />
        <input 
          placeholder="Project Deadline" 
          type="date" 
          value={form.projectDeadline} 
          onChange={e => setForm({ ...form, projectDeadline: e.target.value })}
          required
        />
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
              <button onClick={() => setMessageModal({ clientId: c._id, clientName: c.name, freelancerId: c.userId })}>💬 Message</button>
              <button onClick={() => inviteClientUser(c)}>Invite to Portal</button>
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
      
      {messageModal && (
        <MessageModal
          clientId={messageModal.clientId}
          clientName={messageModal.clientName}
          freelancerId={messageModal.freelancerId}
          onClose={() => setMessageModal(null)}
        />
      )}
    </div>
  )
}


