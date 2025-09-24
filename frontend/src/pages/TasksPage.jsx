import { useEffect, useState } from 'react'
import { createTask, deleteTask, getProjects, getTasks, updateTask } from '../api'

export default function TasksPage() {
  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState('')
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('todo')
  const [statusFilter, setStatusFilter] = useState('all')

  async function load() {
    const ps = await getProjects()
    setProjects(ps)
    // Load tasks for a selected project, or all tasks if none selected
    setTasks(await getTasks(projectId))
  }
  useEffect(() => { load() }, [projectId])

  async function submit(e) {
    e.preventDefault()
    await createTask({ projectId, title, status })
    setTitle('')
    setStatus('todo')
    setTasks(await getTasks(projectId))
  }

  async function quickAdd() {
    const generatedTitle = `Task ${new Date().toLocaleString()}`
    await createTask({ projectId, title: generatedTitle, status })
    setStatus('todo')
    setTasks(await getTasks(projectId))
  }

  async function changeStatus(t, next) {
    await updateTask(t._id, { status: next })
    setTasks(await getTasks(projectId))
  }

  async function remove(t) {
    if (!confirm('Delete task?')) return
    await deleteTask(t._id)
    setTasks(await getTasks(projectId))
  }

  const visibleTasks = tasks.filter(t => statusFilter === 'all' ? true : t.status === statusFilter)

  return (
    <div>
      <h2>Tasks</h2>
      <div className="row" style={{ gap: 8, marginBottom: 8 }}>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}>
          <option value="">All projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        {/* Move quick add controls close to project selector */}
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="todo">To do</option>
          <option value="in_progress">Ongoing</option>
          <option value="done">Completed</option>
        </select>
        <button onClick={quickAdd}>Add</button>
        <div style={{ marginLeft: 'auto' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="todo">To do</option>
          <option value="in_progress">Ongoing</option>
          <option value="done">Completed</option>
        </select>
      </div>
      <>
          <ul>
            {visibleTasks.length === 0 && (
              <li className="empty">No tasks match the current filters.</li>
            )}
            {visibleTasks.map(t => {
              const proj = projects.find(p => p._id === t.projectId)
              const projName = proj ? proj.name : '—'
              const dateOnly = t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''
              return (
              <li key={t._id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ minWidth: 160 }}>{projName}</span>
                <span style={{ color: 'var(--muted)' }}>{dateOnly}</span>
                <select value={t.status} onChange={e => changeStatus(t, e.target.value)}>
                  <option value="todo">To do</option>
                  <option value="in_progress">Ongoing</option>
                  <option value="done">Completed</option>
                </select>
                <button onClick={() => remove(t)}>Delete</button>
              </li>
            )})}
          </ul>
        </>
    </div>
  )
}


