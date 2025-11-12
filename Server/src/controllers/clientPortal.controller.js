import Project from '../models/Project.js';
import Task from '../models/Task.js';
import WorkSession from '../models/WorkSession.js';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';

// Get client's own information
export async function getClientInfo(req, res) {
  const client = await Client.findById(req.userClientId);
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
}

// List all projects for this client
export async function listClientProjects(req, res) {
  const projects = await Project.find({ clientId: req.userClientId })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(projects);
}

// Get a specific project with details
export async function getClientProject(req, res) {
  const project = await Project.findOne({ 
    _id: req.params.id, 
    clientId: req.userClientId 
  }).populate('userId', 'name email');
  
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
}

// List tasks for a project
export async function listClientProjectTasks(req, res) {
  const { projectId } = req.params;
  
  // Verify project belongs to client
  const project = await Project.findOne({ _id: projectId, clientId: req.userClientId });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  
  const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
  res.json(tasks);
}

// Get work sessions for client's projects
export async function getClientWorkSessions(req, res) {
  const { projectId, startDate, endDate } = req.query;
  
  // Build query
  const query = { clientId: req.userClientId };
  
  if (projectId) {
    // Verify project belongs to client
    const project = await Project.findOne({ _id: projectId, clientId: req.userClientId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    query.projectId = projectId;
  }
  
  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) query.startTime.$gte = new Date(startDate);
    if (endDate) query.startTime.$lte = new Date(endDate);
  }
  
  // Get all projects for this client
  const projects = await Project.find({ clientId: req.userClientId }).select('_id');
  const projectIds = projects.map(p => p._id);
  
  const sessions = await WorkSession.find({ projectId: { $in: projectIds } })
    .populate('projectId', 'name')
    .populate('taskId', 'title')
    .sort({ startTime: -1 });
  
  res.json(sessions);
}

// Get invoices for this client
export async function getClientInvoices(req, res) {
  const invoices = await Invoice.find({ clientId: req.userClientId })
    .populate('projectId', 'name')
    .sort({ issueDate: -1 });
  res.json(invoices);
}

// Get a specific invoice
export async function getClientInvoice(req, res) {
  const invoice = await Invoice.findOne({ 
    _id: req.params.id, 
    clientId: req.userClientId 
  }).populate('projectId', 'name');
  
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
}

// Get client dashboard summary
export async function getClientDashboard(req, res) {
  const projects = await Project.find({ clientId: req.userClientId });
  const projectIds = projects.map(p => p._id);
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  
  const tasks = await Task.find({ projectId: { $in: projectIds } });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  
  const sessions = await WorkSession.find({ projectId: { $in: projectIds } });
  const totalHours = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60;
  
  const invoices = await Invoice.find({ clientId: req.userClientId });
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  res.json({
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    totalHours: Math.round(totalHours * 100) / 100,
    totalInvoiced,
    pendingAmount,
    recentProjects: projects.slice(0, 5),
    recentInvoices: invoices.slice(0, 5)
  });
}

// Get time tracking report for client
export async function getClientTimeReport(req, res) {
  const { startDate, endDate, projectId } = req.query;
  
  const projects = await Project.find({ clientId: req.userClientId });
  const projectIds = projectId 
    ? [projectId] 
    : projects.map(p => p._id);
  
  const query = { projectId: { $in: projectIds } };
  
  if (startDate || endDate) {
    query.startTime = {};
    if (startDate) query.startTime.$gte = new Date(startDate);
    if (endDate) query.startTime.$lte = new Date(endDate);
  }
  
  const sessions = await WorkSession.find(query)
    .populate('projectId', 'name hourlyRate')
    .populate('taskId', 'title')
    .sort({ startTime: -1 });
  
  // Group by project
  const byProject = {};
  sessions.forEach(session => {
    const projId = session.projectId._id.toString();
    if (!byProject[projId]) {
      byProject[projId] = {
        projectId: projId,
        projectName: session.projectId.name,
        sessions: [],
        totalMinutes: 0,
        totalHours: 0
      };
    }
    byProject[projId].sessions.push(session);
    byProject[projId].totalMinutes += session.durationMinutes || 0;
  });
  
  // Calculate totals
  Object.values(byProject).forEach(proj => {
    proj.totalHours = Math.round((proj.totalMinutes / 60) * 100) / 100;
  });
  
  res.json({
    sessions,
    byProject: Object.values(byProject),
    totalSessions: sessions.length,
    totalMinutes: sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0),
    totalHours: Math.round(sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60 * 100) / 100
  });
}
