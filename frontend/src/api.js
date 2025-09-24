import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function register(data) {
  const res = await api.post('/auth/register', data)
  return res.data
}

export async function login(data) {
  const res = await api.post('/auth/login', data)
  return res.data
}

// Clients
export const getClients = async () => (await api.get('/clients')).data
export const createClient = async (payload) => (await api.post('/clients', payload)).data
export const updateClient = async (id, payload) => (await api.put(`/clients/${id}`, payload)).data
export const deleteClient = async (id) => (await api.delete(`/clients/${id}`)).data

// Projects
export const getProjects = async (clientId) => (await api.get('/projects', { params: { clientId } })).data
export const createProject = async (payload) => (await api.post('/projects', payload)).data
export const updateProject = async (id, payload) => (await api.put(`/projects/${id}`, payload)).data
export const deleteProject = async (id) => (await api.delete(`/projects/${id}`)).data

// Tasks
export const getTasks = async (projectId) => (await api.get('/tasks', { params: { projectId } })).data
export const createTask = async (payload) => (await api.post('/tasks', payload)).data
export const updateTask = async (id, payload) => (await api.put(`/tasks/${id}`, payload)).data
export const deleteTask = async (id) => (await api.delete(`/tasks/${id}`)).data

// Work Sessions
export const listSessions = async (params) => (await api.get('/work', { params })).data
export const startTimer = async (payload) => (await api.post('/work/start', payload)).data
export const stopTimer = async (id) => (await api.post(`/work/${id}/stop`)).data
export const manualLog = async (payload) => (await api.post('/work/manual', payload)).data
export const deleteSession = async (id) => (await api.delete(`/work/${id}`)).data

// Invoices
export const listInvoices = async () => (await api.get('/invoices')).data
export const createInvoiceFromRange = async (payload) => (await api.post('/invoices/create-from-range', payload)).data
export const sendInvoiceEmail = async (id) => (await api.post(`/invoices/${id}/send`)).data
export const deleteInvoice = async (id) => (await api.delete(`/invoices/${id}`)).data

// Reports
export const getSummary = async (params) => (await api.get('/reports/summary', { params })).data
export const getGrouped = async (params) => (await api.get('/reports/grouped', { params })).data

// Calendar
export const getDaily = async (date) => (await api.get('/calendar/daily', { params: { date } })).data
export const getWeekly = async (date) => (await api.get('/calendar/weekly', { params: { date } })).data
export const getMonthly = async (date) => (await api.get('/calendar/monthly', { params: { date } })).data


