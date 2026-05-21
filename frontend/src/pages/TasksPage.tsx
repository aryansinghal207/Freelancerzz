import { useEffect, useState } from 'react'
import { createTask, deleteTask, getProjects, getTasks, updateTask } from '../api'
import { Card, Button, Input, Badge } from '../components/ui'
import { TrendingUp, CheckCircle, List, Plus, Calendar, Settings } from 'lucide-react'

export default function TasksPage() {
  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState('')
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('all')
  const [filterProjectId, setFilterProjectId] = useState('')

  async function load() {
    const ps = await getProjects()
    setProjects(ps)
    // Load tasks for a selected project, or all tasks if none selected
    setTasks(await getTasks(filterProjectId))
  }
  useEffect(() => { load() }, [filterProjectId])

  async function handleSubmit(e) {
    e.preventDefault()
    const taskStatus = status === 'all' ? 'todo' : status
    await createTask({ projectId: projectId || filterProjectId, title, status: taskStatus })
    setTitle('')
    setStatus('all')
    setTasks(await getTasks(filterProjectId))
  }

  async function changeStatus(t, next) {
    await updateTask(t.id, { status: next })
    setTasks(await getTasks(filterProjectId))
  }

  async function remove(t) {
    if (!confirm('Delete task?')) return
    await deleteTask(t.id)
    setTasks(await getTasks(filterProjectId))
  }

  const visibleTasks = tasks.filter(t => status === 'all' ? true : t.status === status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-bold text-gradient-primary">Tasks</h1>
        <Button variant="primary" onClick={() => {
          // Quick add modal or inline form toggle
          // For simplicity, we'll just focus the title input
          // In a real app, you might want a modal
        }}>
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-dark-text/60 font-medium mb-2 block">Project</label>
            <select
              value={filterProjectId}
              onChange={e => setFilterProjectId(e.target.value)}
              className="input w-full"
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-dark-text/60 font-medium mb-2 block">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="input w-full"
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSubmit} className="w-full">
              Add Task
            </Button>
          </div>
        </div>
        {/* Task Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-dark-text/60 font-medium mb-2 block">Task Title</label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              className="w-full"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <label className="text-dark-text/60 font-medium mb-2 block">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="input w-full"
              >
                <option value="all">All</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full lg:w-auto">
              Create Task
            </Button>
          </div>
        </form>
      </Card>

      {/* Tasks List */}
      <Card className="p-6">
        {visibleTasks.length > 0 ? (
          <div className="space-y-4">
            {visibleTasks.map(t => (
              <div key={t.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-dark-text/60 text-xs">
                      {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
                    </span>
                    <span className="font-medium text-dark-text">{t.title}</span>
                  </div>
                  {t.description && (
                    <p className="text-dark-text/60 text-sm line-clamp-2">{t.description}</p>
                  )}
                </div>
                <div className="flex flex-col space-y-1 items-end sm:self-auto">
                  <Badge
                    variant={
                      t.status === 'todo'
                        ? 'secondary'
                        : t.status === 'in_progress'
                        ? 'warning'
                        : t.status === 'done'
                        ? 'success'
                        : 'ghost'
                    }
                  >
                    {t.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      onClick={() => changeStatus(t, t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'todo')}
                      size="sm"
                    >
                      Change Status
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => remove(t)}
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-text/60">
            No tasks found. Add a task to get started.
          </div>
        )}
      </Card>
    </div>
  )
}