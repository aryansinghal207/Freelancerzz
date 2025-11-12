import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    
    // Fetch user to get role and clientId
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
    
    req.userId = user._id.toString();
    req.userRole = user.role;
    req.userClientId = user.clientId;
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Legacy support - use authenticate instead
export function requireAuth(req, res, next) {
  return authenticate(req, res, next);
}

// Middleware to require freelancer role
export function requireFreelancer(req, res, next) {
  if (req.userRole !== 'freelancer') {
    return res.status(403).json({ message: 'Freelancer access required' });
  }
  next();
}

// Middleware to require client role
export function requireClient(req, res, next) {
  if (req.userRole !== 'client') {
    return res.status(403).json({ message: 'Client access required' });
  }
  next();
}

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}


