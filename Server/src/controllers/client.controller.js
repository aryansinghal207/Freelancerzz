import prisma from '../prisma.js';

export async function listClients(req, res) {
  const clients = await prisma.client.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(clients);
}

export async function createClient(req, res) {
  const { projectName, projectDescription, projectDeadline, ...clientData } = req.body;
  const client = await prisma.client.create({
    data: { ...clientData, userId: req.userId }
  });

  if (projectName) {
    await prisma.project.create({
      data: {
        userId: req.userId,
        clientId: client.id,
        name: projectName,
        description: projectDescription || '',
        deadline: projectDeadline ? new Date(projectDeadline) : null,
        hourlyRate: client.defaultHourlyRate,
        status: 'active'
      }
    });
  }

  res.status(201).json(client);
}

export async function getClient(req, res) {
  const client = await prisma.client.findFirst({
    where: { id: req.params.id, userId: req.userId }
  });
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json(client);
}

export async function updateClient(req, res) {
  const result = await prisma.client.updateMany({
    where: { id: req.params.id, userId: req.userId },
    data: req.body
  });

  if (result.count === 0) return res.status(404).json({ message: 'Not found' });

  // Keep the client portal user profile in sync with the client record
  const userUpdateData = {};
  if (req.body.name) userUpdateData.name = req.body.name;
  if (req.body.email) userUpdateData.email = req.body.email;
  if (Object.keys(userUpdateData).length > 0) {
    await prisma.user.updateMany({
      where: { clientId: req.params.id, role: 'client' },
      data: userUpdateData
    });
  }

  const client = await prisma.client.findUnique({ where: { id: req.params.id } });
  res.json(client);
}

export async function deleteClient(req, res) {
  const result = await prisma.client.deleteMany({
    where: { id: req.params.id, userId: req.userId }
  });
  if (result.count === 0) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}
