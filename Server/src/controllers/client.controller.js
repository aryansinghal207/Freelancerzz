import Client from '../models/Client.js';

export async function listClients(req, res) {
  const clients = await Client.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(clients);
}

export async function createClient(req, res) {
  const data = { ...req.body, userId: req.userId };
  const created = await Client.create(data);
  res.status(201).json(created);
}

export async function getClient(req, res) {
  const client = await Client.findOne({ _id: req.params.id, userId: req.userId });
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json(client);
}

export async function updateClient(req, res) {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json(client);
}

export async function deleteClient(req, res) {
  const deleted = await Client.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}


