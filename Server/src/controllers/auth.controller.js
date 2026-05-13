import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';
import { signToken } from '../middleware/auth.js';
import { sendClientInvitationEmail } from '../config/email.js';

export async function register(req, res) {
  const { name, email, password, role = 'freelancer' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (!['freelancer', 'client'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role }
  });

  const token = signToken(user.id);
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user.id);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } });
}

export async function inviteClient(req, res) {
  const { clientId, email, name } = req.body;
  if (!clientId || !email || !name) return res.status(400).json({ message: 'Missing fields' });

  const client = await prisma.client.findFirst({
    where: { id: clientId, userId: req.userId }
  });
  if (!client) return res.status(404).json({ message: 'Client not found' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'User with this email already exists' });

  const freelancer = await prisma.user.findUnique({ where: { id: req.userId } });
  const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const clientUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'client',
      clientId: client.id
    }
  });

  try {
    await sendClientInvitationEmail(email, name, tempPassword, freelancer?.name || 'Freelancer');
    return res.status(201).json({
      message: 'Client invited successfully. Credentials have been sent to their email.',
      clientUser: { id: clientUser.id, email: clientUser.email }
    });
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
    return res.status(201).json({
      message: 'Client invited but email failed to send. Please share credentials manually.',
      clientUser: { id: clientUser.id, email: clientUser.email, tempPassword },
      emailError: 'Failed to send email'
    });
  }
}

export async function registerClient(req, res) {
  const { name, email, password, clientId } = req.body;
  if (!name || !email || !password || !clientId) return res.status(400).json({ message: 'Missing fields' });

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return res.status(404).json({ message: 'Invalid client link' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'client', clientId: client.id }
  });

  const token = signToken(user.id);
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } });
}

export async function getProfile(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, role: true, clientId: true }
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}
