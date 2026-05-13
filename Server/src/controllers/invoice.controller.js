import dayjs from 'dayjs';
import prisma from '../prisma.js';
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

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: req.userId } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const derivedClientId = project.clientId;

  const sessions = await prisma.workSession.findMany({
    where: {
      userId: req.userId,
      projectId,
      invoiced: false,
      endTime: { not: null },
      startTime: { gte: fromDate, lte: toDate }
    },
    orderBy: { startTime: 'asc' }
  });

  const items = sessions.map((s) => {
    const hours = toHours(s.durationMinutes);
    const rate = s.hourlyRate || 0;
    return {
      workSessionId: s.id,
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

  const invoice = await prisma.invoice.create({
    data: {
      userId: req.userId,
      clientId: derivedClientId,
      projectId,
      number: invoiceNumber,
      items,
      subtotal,
      taxPercent: Number(taxPercent),
      taxAmount,
      total,
      currency,
      status: 'draft'
    }
  });

  await prisma.workSession.updateMany({
    where: { id: { in: sessions.map((s) => s.id) } },
    data: { invoiced: true, invoiceId: invoice.id }
  });

  const client = await prisma.client.findUnique({ where: { id: derivedClientId } });
  const pdfPath = await generateInvoicePDF({ invoice, client, project });
  await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfPath } });

  res.status(201).json({ ...invoice, pdfPath });
}

export async function listInvoices(req, res) {
  const invoices = await prisma.invoice.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(invoices);
}

export async function getInvoice(req, res) {
  const inv = await prisma.invoice.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!inv) return res.status(404).json({ message: 'Not found' });
  res.json(inv);
}

export async function sendInvoiceEmail(req, res) {
  const inv = await prisma.invoice.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!inv) return res.status(404).json({ message: 'Not found' });

  const client = await prisma.client.findUnique({ where: { id: inv.clientId } });
  if (!client) return res.status(404).json({ message: 'Client not found' });

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

  await prisma.invoice.update({ where: { id: inv.id }, data: { status: 'sent' } });
  res.json({ success: true });
}

export async function deleteInvoice(req, res) {
  const inv = await prisma.invoice.findFirst({ where: { id: req.params.id, userId: req.userId } });
  if (!inv) return res.status(404).json({ message: 'Not found' });

  try {
    await prisma.workSession.updateMany({
      where: { invoiceId: inv.id },
      data: { invoiced: false, invoiceId: null }
    });
    if (inv.pdfPath && fs.existsSync(inv.pdfPath)) {
      try { fs.unlinkSync(inv.pdfPath); } catch (_) {}
    }
    await prisma.invoice.delete({ where: { id: inv.id } });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'Failed to delete invoice' });
  }
}
