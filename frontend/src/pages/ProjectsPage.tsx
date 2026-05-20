import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { getClients, createProject, deleteProject, getProjects, updateProject } from '../api'
import PageTemplate from '../components/layout/PageTemplate'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ clientId: '', name: '', description: '', hourlyRate: '' })

  async function load() {
    try {
      setLoading(true)
      const [c, p] = await Promise.all([getClients(), getProjects()])
      setClients(c)
      setProjects(p)
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
      if (editingId) {
        await updateProject(editingId, {
          ...form,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        })
      } else {
        await createProject({
          ...form,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        })
      }
      setForm({ clientId: '', name: '', description: '', hourlyRate: '' })
      setEditingId(null)
      setShowForm(false)
      load()
    } catch (error) {
      alert('Failed to save project')
    }
  }

  async function edit(p: any) {
    setEditingId(p._id)
    setForm({
      clientId: p.clientId,
      name: p.name,
      description: p.description || '',
      hourlyRate: p.hourlyRate ? String(p.hourlyRate) : '',
    })
    setShowForm(true)
  }

  async function remove(p: any) {
    if (!window.confirm(`Delete "${p.name}"?`)) return
    try {
      await deleteProject(p._id)
      load()
    } catch (error) {
      alert('Failed to delete project')
    }
  }

  const clientNameOf = (p: any) => {
    const c = clients.find((c) => c.id === p.clientId)
    return c ? c.name : 'Unknown'
  }

  const statusColor: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    active: 'success',
    completed: 'info',
    paused: 'warning',
    cancelled: 'danger',
  }

  return (
    <PageTemplate
      title="Projects"
      subtitle="Manage all your projects"
      actions={
        <Button
          variant="primary"
          onClick={() => {
            setEditingId(null)
            setForm({ clientId: '', name: '', description: '', hourlyRate: '' })
            setShowForm(true)
          }}
          icon={<Plus size={20} />}
        >
          New Project
        </Button>
      }
    >
      {/* Add/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false)
          setEditingId(null)
        }}
        title={editingId ? 'Edit Project' : 'New Project'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submit}>
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="label block mb-2">Client *</label>
            <select
              className="input"
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              required
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Project Name"
            placeholder="My Project"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Project description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Hourly Rate (₹)"
            type="number"
            placeholder="500"
            value={form.hourlyRate}
            onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
          />
        </form>
      </Modal>

      {/* Projects Table */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-lg" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-dark-muted mb-6">No projects yet</p>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Create your first project
            </Button>
          </div>
        </Card>
      ) : (
        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AnimatePresence>
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="!p-0 overflow-hidden">
                  <div className="p-6 flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-dark-text">{project.name}</h3>
                        <Badge variant={statusColor[project.status] || 'info'}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-2 md:grid-3 gap-4 text-sm text-dark-muted">
                        <div>
                          <span className="font-semibold text-dark-text">Client:</span> {clientNameOf(project)}
                        </div>
                        {project.hourlyRate && (
                          <div>
                            <span className="font-semibold text-dark-text">Rate:</span> ₹{project.hourlyRate}/hr
                          </div>
                        )}
                        {project.description && (
                          <div className="col-span-full">
                            <span className="font-semibold text-dark-text">Description:</span> {project.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => edit(project)}
                        icon={<Edit2 size={16} />}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => remove(project)}
                        icon={<Trash2 size={16} />}
                        className="border-red-500/30 text-red-400 hover:text-red-300"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageTemplate>
  )
}


