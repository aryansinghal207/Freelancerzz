import prisma from '../prisma.js';

export async function sendMessage(req, res) {
  const { clientId, message } = req.body;
  let recipientUserId;

  if (req.userRole === 'freelancer') {
    const client = await prisma.client.findFirst({ where: { id: clientId, userId: req.userId } });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const clientUser = await prisma.user.findFirst({ where: { role: 'client', clientId } });
    recipientUserId = clientUser?.id;
  } else {
    if (clientId !== req.userClientId) return res.status(403).json({ message: 'Unauthorized' });
    const client = await prisma.client.findUnique({ where: { id: clientId } });
    recipientUserId = client?.userId;
  }

  const newMessage = await prisma.message.create({
    data: {
      clientId,
      senderId: req.userId,
      senderRole: req.userRole,
      message
    }
  });

  const populated = await prisma.message.findUnique({
    where: { id: newMessage.id },
    include: { sender: { select: { name: true, email: true } } }
  });

  const response = { ...populated, recipientUserId };
  res.status(201).json(response);
}

export async function getMessages(req, res) {
  const { clientId } = req.params;
  if (req.userRole === 'freelancer') {
    const client = await prisma.client.findFirst({ where: { id: clientId, userId: req.userId } });
    if (!client) return res.status(404).json({ message: 'Client not found' });
  } else {
    if (clientId !== req.userClientId) return res.status(403).json({ message: 'Unauthorized' });
  }

  const messages = await prisma.message.findMany({
    where: { clientId },
    include: { sender: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'asc' }
  });
  res.json(messages);
}

export async function markAsRead(req, res) {
  const { clientId } = req.params;
  await prisma.message.updateMany({
    where: {
      clientId,
      senderId: { not: req.userId },
      read: false
    },
    data: { read: true }
  });
  res.json({ success: true });
}

export async function getUnreadCount(req, res) {
  let where;
  if (req.userRole === 'freelancer') {
    const clients = await prisma.client.findMany({ where: { userId: req.userId }, select: { id: true } });
    const clientIds = clients.map((c) => c.id);
    where = { clientId: { in: clientIds }, senderRole: 'client', read: false };
  } else {
    where = { clientId: req.userClientId, senderRole: 'freelancer', read: false };
  }

  const count = await prisma.message.count({ where });
  res.json({ count });
}
