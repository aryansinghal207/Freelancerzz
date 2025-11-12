import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Client from '../models/Client.js';
import { signToken } from '../middleware/auth.js';
import { sendClientInvitationEmail } from '../config/email.js';

export async function register(req, res) {
  const { name, email, password, role = 'freelancer' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (!['freelancer', 'client'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user._id.toString());
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user._id.toString());
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } });
}

// Invite a client (creates client record and sends invitation)
export async function inviteClient(req, res) {
  const { clientId, email, name } = req.body;
  if (!clientId || !email || !name) return res.status(400).json({ message: 'Missing fields' });
  
  // Verify client exists and belongs to the freelancer
  const client = await Client.findOne({ _id: clientId, userId: req.userId });
  if (!client) return res.status(404).json({ message: 'Client not found' });
  
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'User with this email already exists' });
  
  // Get freelancer info for email
  const freelancer = await User.findById(req.userId);
  
  // Create a temporary password
  const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
  const passwordHash = await bcrypt.hash(tempPassword, 10);
  
  const clientUser = await User.create({ 
    name, 
    email, 
    passwordHash, 
    role: 'client',
    clientId: client._id 
  });
  
  // Send email with credentials
  try {
    await sendClientInvitationEmail(email, name, tempPassword, freelancer.name);
    return res.status(201).json({ 
      message: 'Client invited successfully. Credentials have been sent to their email.',
      clientUser: { id: clientUser._id, email: clientUser.email }
    });
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
    // Still return success but with warning
    return res.status(201).json({ 
      message: 'Client invited but email failed to send. Please share credentials manually.',
      clientUser: { id: clientUser._id, email: clientUser.email, tempPassword },
      emailError: 'Failed to send email'
    });
  }
}

// Client self-registration with client link
export async function registerClient(req, res) {
  const { name, email, password, clientId } = req.body;
  if (!name || !email || !password || !clientId) return res.status(400).json({ message: 'Missing fields' });
  
  // Verify client exists
  const client = await Client.findById(clientId);
  if (!client) return res.status(404).json({ message: 'Invalid client link' });
  
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'client', clientId: client._id });
  const token = signToken(user._id.toString());
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, clientId: user.clientId } });
}