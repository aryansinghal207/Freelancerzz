import dayjs from 'dayjs';
import Invoice from '../models/Invoice.js';
import WorkSession from '../models/WorkSession.js';
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import { generateInvoicePDF } from '../utils/pdf.js';
import nodemailer from 'nodemailer';
import fs from 'fs';

function toHours(minutes) {
  const raw = (minutes || 0) / 60;
  return Math.round(raw * 1000) / 1000;
}

export async function createInvoiceFromRange(req, res) {
  const { clientId, projectId, from, to, taxPercent = 0, currency = 'INR', number } = req.body;
  const fromDate = from ? dayjs(from).toDate() : new Date(0);
  const toDate = to ? dayjs(to).toDate() : new Date();

  const project = await Project.findOne({ _id: projectId, userId: req.user.id });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const derivedClientId = project.clientId;

  const sessions = await WorkSession.find({
    userId: req.user.id,
    projectId,
    startTime: { $gte: fromDate, $lte: toDate },
    invoiced: false,
    endTime: { $ne: null },
  }).sort({ startTime: 1 });

  const items = sessions.map((s) => {
    const hours = toHours(s.durationMinutes);
    const rate = s.hourlyRate || 0;
    return {
      workSessionId: s._id,
      description: s.note || 'Work session',
      hours,
      rate,
      amount: hours * rate,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.amount, 0);
  const taxAmount = subtotal * (Number(taxPercent) / 100);
  const total = subtotal + taxAmount;

  const invoiceNumber = number || `INV-${Date.now()}`;

  const invoice = await Invoice.create({
    userId: req.user.id,
    clientId: derivedClientId,
    projectId,
    number: invoiceNumber,
    items,
    subtotal,
    taxPercent: Number(taxPercent),
    taxAmount,
    total,
    currency,
    status: 'draft',
  });

  await WorkSession.updateMany({ _id: { $in: sessions.map((s) => s._id) } }, { $set: { invoiced: true, invoiceId: invoice._id } });

  const client = await Client.findById(derivedClientId);
  const pdfPath = await generateInvoicePDF({ invoice, client, project });
  invoice.pdfPath = pdfPath;
  await invoice.save();

  res.status(201).json(invoice);
}

export async function listInvoices(req, res) {
  const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(invoices);
}

export async function getInvoice(req, res) {
  const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
  if (!inv) return res.status(404).json({ message: 'Not found' });
  res.json(inv);
}

export async function sendInvoiceEmail(req, res) {
  const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
  if (!inv) return res.status(404).json({ message: 'Not found' });
  const client = await Client.findById(inv.clientId);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@example.com',
    to: client.email,
    subject: `Invoice ${inv.number}`,
    text: `Please find attached invoice ${inv.number} for ${inv.total} ${inv.currency}.`,
    attachments: inv.pdfPath ? [{ filename: `${inv.number}.pdf`, path: inv.pdfPath }] : [],
  });

  inv.status = 'sent';
  await inv.save();
  res.json({ success: true });
}


export async function deleteInvoice(req, res) {
  const inv = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
  if (!inv) return res.status(404).json({ message: 'Not found' });
  try {
    // Mark related sessions as not invoiced
    await WorkSession.updateMany({ invoiceId: inv._id }, { $set: { invoiced: false, invoiceId: null } });
    // Remove PDF file if present
    if (inv.pdfPath && fs.existsSync(inv.pdfPath)) {
      try { fs.unlinkSync(inv.pdfPath); } catch (_) { /* ignore */ }
    }
    await inv.deleteOne();
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to delete invoice' });
  }
}


