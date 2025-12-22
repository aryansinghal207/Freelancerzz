import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import workRoutes from './routes/work.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import reportRoutes from './routes/report.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import clientPortalRoutes from './routes/clientPortal.routes.js';
import messageRoutes from './routes/message.routes.js';
import path from 'path';

dotenv.config();

// Debug: Log email configuration (masked for security)
console.log('Environment Variables Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set (length: ' + process.env.EMAIL_PASS.length + ')' : '✗ Not set');
console.log('EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME || 'Not set');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/freelancer_app';

// Enable verbose mongoose logs in dev
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'freelancer-api' });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState, 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/work', workRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/client-portal', clientPortalRoutes);
app.use('/api/messages', messageRoutes);

// Socket.io authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    socket.userId = payload.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);
  
  // Join user to their personal room
  socket.join(`user:${socket.userId}`);
  
  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { clientId, recipientId } = data;
      // Emit to recipient
      io.to(`user:${recipientId}`).emit('new-message', data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});

// Serve generated invoice PDFs statically
app.use('/invoices', express.static(path.resolve(process.cwd(), 'invoices')));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

async function start() {
  try {
    console.log('Connecting to MongoDB...', MONGO_URI);
    mongoose.connection.on('connected', () => console.log('MongoDB connected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
    await mongoose.connect(MONGO_URI);
    console.log('Starting HTTP server on port', PORT);
    httpServer.listen(PORT, () => {
      console.log(`API running on :${PORT}`);
      console.log('WebSocket server ready for real-time messaging');
    });
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

