import prisma from '../prisma.js';

function ensureClientId(req, res) {
  if (!req.userClientId) {
    res.status(400).json({ message: 'Client ID not found. Please contact your freelancer.' });
    return false;
  }
  return true;
}

export async function getClientInfo(req, res) {
  if (!ensureClientId(req, res)) return;
  const client = await prisma.client.findUnique({ where: { id: req.userClientId } });
  if (!client) return res.status(404).json({ message: 'Client not found' });
  res.json(client);
}

export async function listClientProjects(req, res) {
  if (!ensureClientId(req, res)) return;
  const projects = await prisma.project.findMany({
    where: { clientId: req.userClientId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(projects);
}

export async function getClientProject(req, res) {
  const project = await prisma.project.findFirst({
    where: { id: req.params.id, clientId: req.userClientId },
    include: { user: { select: { name: true, email: true } } }
  });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
}

export async function listClientProjectTasks(req, res) {
  const { projectId } = req.params;
  const project = await prisma.project.findFirst({ where: { id: projectId, clientId: req.userClientId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const tasks = await prisma.task.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } });
  res.json(tasks);
}

export async function getClientWorkSessions(req, res) {
  const { projectId, startDate, endDate } = req.query;
  if (!ensureClientId(req, res)) return;
  const projectFilter = { clientId: req.userClientId };
  if (projectId) projectFilter.id = projectId;
  const projects = await prisma.project.findMany({ where: projectFilter, select: { id: true } });
  const projectIds = projects.map((p) => p.id);
  if (projectIds.length === 0) return res.json([]);

  const where = { projectId: { in: projectIds } };
  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = new Date(startDate);
    if (endDate) where.startTime.lte = new Date(endDate);
  }

  const sessions = await prisma.workSession.findMany({
    where,
    include: {
      project: { select: { name: true } },
      task: { select: { title: true } }
    },
    orderBy: { startTime: 'desc' }
  });
  res.json(sessions);
}

export async function getClientInvoices(req, res) {
  if (!ensureClientId(req, res)) return;
  const invoices = await prisma.invoice.findMany({
    where: { clientId: req.userClientId },
    include: { project: { select: { name: true } } },
    orderBy: { issueDate: 'desc' }
  });
  res.json(invoices);
}

export async function getClientInvoice(req, res) {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, clientId: req.userClientId },
    include: { project: { select: { name: true } } }
  });
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  res.json(invoice);
}

export async function getClientDashboard(req, res) {
  if (!ensureClientId(req, res)) return;
  const projects = await prisma.project.findMany({ where: { clientId: req.userClientId } });
  const projectIds = projects.map((p) => p.id);
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const tasks = await prisma.task.findMany({ where: { projectId: { in: projectIds } } });
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const sessions = await prisma.workSession.findMany({ where: { projectId: { in: projectIds } } });
  const totalHours = Math.round((sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60) * 100) / 100;
  const invoices = await prisma.invoice.findMany({ where: { clientId: req.userClientId } });
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter((inv) => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);

  res.json({
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    totalHours,
    totalInvoiced,
    pendingAmount,
    recentProjects: projects.slice(0, 5),
    recentInvoices: invoices.slice(0, 5)
  });
}

export async function getClientTimeReport(req, res) {
  const { startDate, endDate, projectId } = req.query;
  const projects = await prisma.project.findMany({ where: { clientId: req.userClientId } });
  const projectIds = projectId ? [projectId] : projects.map((p) => p.id);

  const where = { projectId: { in: projectIds } };
  if (startDate || endDate) {
    where.startTime = {};
    if (startDate) where.startTime.gte = new Date(startDate);
    if (endDate) where.startTime.lte = new Date(endDate);
  }

  const sessions = await prisma.workSession.findMany({
    where,
    include: {
      project: { select: { name: true, hourlyRate: true } },
      task: { select: { title: true } }
    },
    orderBy: { startTime: 'desc' }
  });

  const byProject = {};
  sessions.forEach((session) => {
    const projId = session.projectId;
    if (!byProject[projId]) {
      byProject[projId] = {
        projectId: projId,
        projectName: session.project?.name || '',
        sessions: [],
        totalMinutes: 0,
        totalHours: 0
      };
    }
    byProject[projId].sessions.push(session);
    byProject[projId].totalMinutes += session.durationMinutes || 0;
  });

  Object.values(byProject).forEach((proj) => {
    proj.totalHours = Math.round((proj.totalMinutes / 60) * 100) / 100;
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  res.json({
    sessions,
    byProject: Object.values(byProject),
    totalSessions: sessions.length,
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 100) / 100
  });
}

export async function markAllInvoicesPaid(req, res) {
  if (!ensureClientId(req, res)) return;

  try {
    const result = await prisma.invoice.updateMany({
      where: { clientId: req.userClientId, status: { not: 'paid' } },
      data: { status: 'paid', paidAt: new Date() }
    });
    res.json({ success: true, message: `${result.count} invoice(s) marked as paid`, modifiedCount: result.count });
  } catch (error) {
    console.error('Error marking invoices as paid:', error);
    res.status(500).json({ message: 'Failed to mark invoices as paid' });
  }
}
