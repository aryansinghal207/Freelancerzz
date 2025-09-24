import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function formatSecondsToHMS(totalSeconds) {
  const sec = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function hoursToHMS(hours) {
  const seconds = Math.round((hours || 0) * 3600);
  return formatSecondsToHMS(seconds);
}

export function generateInvoicePDF({ invoice, client, project }) {
  const outDir = path.resolve(process.cwd(), 'invoices');
  ensureDirSync(outDir);
  const filePath = path.join(outDir, `${invoice.number}.pdf`);
  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.fontSize(20).text('Invoice', { align: 'right' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice #: ${invoice.number}`);
  doc.text(`Issue Date: ${new Date(invoice.issueDate).toDateString()}`);
  if (invoice.dueDate) doc.text(`Due Date: ${new Date(invoice.dueDate).toDateString()}`);
  doc.moveDown();

  doc.text(`Bill To: ${client.name}`);
  if (client.email) doc.text(client.email);
  if (client.address) doc.text(client.address);
  doc.moveDown();

  doc.text(`Project: ${project.name}`);
  doc.moveDown();

  doc.text('Items:');
  doc.moveDown(0.5);
  let totalHours = 0;
  invoice.items.forEach((it) => {
    totalHours += it.hours || 0;
    doc.text(`${it.description || 'Work'} - ${hoursToHMS(it.hours)} @ ₹${it.rate.toFixed(2)} = ₹${it.amount.toFixed(2)} ${invoice.currency}`);
  });
  doc.moveDown();

  doc.text(`Total Time: ${hoursToHMS(totalHours)}`);
  doc.text(`Subtotal: ₹${invoice.subtotal.toFixed(2)} ${invoice.currency}`);
  if (invoice.taxPercent) doc.text(`Tax (${invoice.taxPercent}%): ₹${invoice.taxAmount.toFixed(2)} ${invoice.currency}`);
  doc.fontSize(14).text(`Total: ₹${invoice.total.toFixed(2)} ${invoice.currency}`, { align: 'right' });

  doc.end();

  return new Promise((resolve) => {
    stream.on('finish', () => resolve(filePath));
  });
}


