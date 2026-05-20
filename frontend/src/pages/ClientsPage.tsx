import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Mail, Phone, MapPin, DollarSign, AlertCircle } from 'lucide-react'
import {
  createClient,
  deleteClient,
  getClients,
  updateClient,
  getProjects,
  inviteClient,
} from '../api'
import PageTemplate from '../components/layout/PageTemplate'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import MessageModal from '../components/MessageModal'

interface ClientData {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  defaultHourlyRate?: number
  projectName?: string
  projectDescription?: string
  projectDeadline?: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string>('')
  const [clientProjects, setClientProjects] = useState<Record<string, any>>({})
  const [messageModal, setMessageModal] = useState<any>(null)
  const [form, setForm] = useState<ClientData>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    defaultHourlyRate: 0,
    projectName: '',
    projectDescription: '',
    projectDeadline: '',
  })

  async function load() {
    try {
      setLoading(true)
      setClients(await getClients())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const clientData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        defaultHourlyRate: form.defaultHourlyRate || 0,
        projectName: form.projectName,
        projectDescription: form.projectDescription,
        projectDeadline: form.projectDeadline,
      }

      if (editingId) {
        await updateClient(editingId, clientData)
      } else {
        await createClient(clientData)
      }

      setForm({
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        defaultHourlyRate: 0,
        projectName: '',
        projectDescription: '',
        projectDeadline: '',
      })
      setEditingId(null)
      setShowForm(false)
      load()
    } catch (error) {
      alert('Failed to save client')
    }
  }

  async function edit(c: any) {
    setEditingId(c.id)
    setForm({
      id: c.id,
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      address: c.address || '',
      defaultHourlyRate: c.defaultHourlyRate || 0,
      projectName: '',
      projectDescription: '',
      projectDeadline: '',
    })
    setShowForm(true)
  }

  async function remove(c: any) {
    if (!window.confirm(`Delete ${c.name}? This action cannot be undone.`)) return
    try {
      await deleteClient(c.id)
      load()
    } catch (error) {
      alert('Failed to delete client')
    }
  }

  async function toggleView(c: any) {
    if (expandedId === c.id) {
      setExpandedId('')
      return
    }
    setExpandedId(c.id)
    if (!clientProjects[c.id]) {
      const projects = await getProjects(c.id)
      setClientProjects((prev) => ({ ...prev, [c.id]: projects }))
    }
  }

  async function inviteClientUser(c: any) {
    const email = prompt('Enter client email for portal access:', c.email || '')
    if (!email) return
    const name = prompt('Enter client name:', c.name || '')
    if (!name) return

    try {
      const result = await inviteClient({ clientId: c.id, email, name })
      if (result.emailError) {
        alert(
          `Client invited successfully!\n\n⚠️ Email delivery failed. Please share these credentials manually:\n\nEmail: ${result.clientUser.email}\nPassword: ${result.clientUser.tempPassword}`
        )
      } else {
        alert(
          `✅ Client invited successfully!\n\nCredentials have been sent to ${email}.\nThe client will receive an email with their login details.`
        )
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to invite client')
    }
  }

  return (
    <PageTemplate
      title="Clients"
      subtitle="Manage your clients and projects"
      actions={
        <Button
          variant="primary"
          onClick={() => {
            setEditingId(null)
            setForm({
              id: '',
              name: '',
              email: '',
              phone: '',
              address: '',
              defaultHourlyRate: 0,
              projectName: '',
              projectDescription: '',
              projectDeadline: '',
            })
            setShowForm(true)
          }}
          icon={<Plus size={20} />}
        >
          New Client
        </Button>
      }
    >
      {/* Add/Edit Client Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingId(null)
        }}
        title={editingId ? 'Edit Client' : 'Add New Client'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <Input
            label="Client Name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+91 9999999999"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Address"
            placeholder="City, Country"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Input
            label="Default Hourly Rate (₹)"
            type="number"
            placeholder="500"
            value={form.defaultHourlyRate}
            onChange={(e) => setForm({ ...form, defaultHourlyRate: Number(e.target.value) })}
          />
        </form>
      </Modal>

      {/* Clients Grid */}
      {loading ? (
        <div className="grid grid-auto gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Mail size={64} />
          </div>
          <h3 className="empty-state-title">No clients yet</h3>
          <p className="empty-state-description">Create your first client to get started</p>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            icon={<Plus size={20} />}
          >
            Add Client
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-2 lg:grid-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <AnimatePresence>
            {clients.map((client, idx) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover className="flex flex-col h-full">
                  {/* Client Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-dark-text mb-1">{client.name}</h3>
                      <p className="text-dark-muted text-sm">{client.email || 'No email'}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center font-bold text-white text-sm">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm text-dark-muted">
                        <Phone size={16} />
                        {client.phone}
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2 text-sm text-dark-muted">
                        <MapPin size={16} />
                        {client.address}
                      </div>
                    )}
                    {client.defaultHourlyRate && (
                      <div className="flex items-center gap-2 text-sm text-dark-muted">
                        <DollarSign size={16} />₹{client.defaultHourlyRate}/hour
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => edit(client)}
                      icon={<Edit2 size={16} />}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => inviteClientUser(client)}
                      icon={<Mail size={16} />}
                      className="flex-1"
                    >
                      Invite
                    </Button>
                  </div>

                  {/* Projects Toggle */}
                  <button
                    onClick={() => toggleView(client)}
                    className="w-full p-2 text-sm font-medium text-primary-400 hover:bg-white/5 rounded-lg transition-all flex items-center justify-between"
                  >
                    <span>Projects</span>
                    {expandedId === client.id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>

                  {/* Projects List */}
                  <AnimatePresence>
                    {expandedId === client.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-white/10 space-y-2"
                      >
                        {clientProjects[client.id]?.length > 0 ? (
                          clientProjects[client.id].map((proj: any) => (
                            <div
                              key={proj.id}
                              className="p-2 bg-white/5 rounded-lg text-sm"
                            >
                              <p className="font-medium text-dark-text">{proj.name}</p>
                              <p className="text-dark-muted text-xs">₹{proj.hourlyRate}/hr</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-dark-muted text-sm">No projects</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => remove(client)}
                    className="w-full mt-auto p-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center gap-2 border border-red-500/20"
                  >
                    <Trash2 size={16} />
                    Delete
                  </motion.button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {messageModal && (
        <MessageModal
          isOpen={true}
          onClose={() => setMessageModal(null)}
          clientId={messageModal.id}
        />
      )}
    </PageTemplate>
  )
}
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
          <li key={c.id}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>{c.name} {c.email ? `- ${c.email}` : ''}</span>
              <button className="secondary" onClick={() => toggleView(c)}>{expandedId === c.id ? 'Hide' : 'View'}</button>
              <button onClick={() => setMessageModal({ clientId: c.id, clientName: c.name, freelancerId: c.userId })}>💬 Message</button>
              <button onClick={() => inviteClientUser(c)}>Invite to Portal</button>
              <button onClick={() => edit(c)}>Edit</button>
              <button className="danger" onClick={() => remove(c)}>Delete</button>
            </div>
            {expandedId === c.id && (
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
                    {(clientProjects[c.id] || []).map(p => (
                      <li key={p.id}>
                        <span>{p.name}</span>
                        <span>{p.hourlyRate ? `₹${p.hourlyRate}` : '—'}</span>
                      </li>
                    ))}
                    {(!clientProjects[c.id] || clientProjects[c.id].length === 0) && (
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


