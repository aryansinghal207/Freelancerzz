import Message from '../models/Message.js';
import Client from '../models/Client.js';
import User from '../models/User.js';

export async function sendMessage(req, res) {
  const { clientId, message } = req.body;
  
  let recipientUserId;
  
  // Verify client exists and user has access
  if (req.userRole === 'freelancer') {
    const client = await Client.findOne({ _id: clientId, userId: req.userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    
    // Find the client user (User with role=client and clientId matching this Client)
    const clientUser = await User.findOne({ role: 'client', clientId: clientId });
    recipientUserId = clientUser?._id;
  } else {
    // For client users, verify they're messaging their own freelancer
    if (clientId !== req.userClientId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // Get the freelancer userId from the Client record
    const client = await Client.findById(clientId);
    recipientUserId = client?.userId;
  }
  
  const newMessage = await Message.create({
    clientId,
    senderId: req.userId,
    senderRole: req.userRole,
    message
  });
  
  const populated = await Message.findById(newMessage._id).populate('senderId', 'name email');
  
  // Add recipientUserId to response for socket emission
  const response = populated.toObject();
  response.recipientUserId = recipientUserId;
  
  res.status(201).json(response);
}

export async function getMessages(req, res) {
  const { clientId } = req.params;
  
  // Verify access
  if (req.userRole === 'freelancer') {
    const client = await Client.findOne({ _id: clientId, userId: req.userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });
  } else {
    if (clientId !== req.userClientId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  }
  
  const messages = await Message.find({ clientId })
    .populate('senderId', 'name email')
    .sort({ createdAt: 1 });
    
  res.json(messages);
}

export async function markAsRead(req, res) {
  const { clientId } = req.params;
  
  await Message.updateMany(
    { 
      clientId, 
      senderId: { $ne: req.userId },
      read: false 
    },
    { read: true }
  );
  
  res.json({ success: true });
}

export async function getUnreadCount(req, res) {
  let query;
  
  if (req.userRole === 'freelancer') {
    // Get unread messages from all clients
    const clients = await Client.find({ userId: req.userId }).select('_id');
    const clientIds = clients.map(c => c._id);
    query = { 
      clientId: { $in: clientIds },
      senderRole: 'client',
      read: false 
    };
  } else {
    // Get unread messages from freelancer
    query = {
      clientId: req.userClientId,
      senderRole: 'freelancer',
      read: false
    };
  }
  
  const count = await Message.countDocuments(query);
  res.json({ count });
}
