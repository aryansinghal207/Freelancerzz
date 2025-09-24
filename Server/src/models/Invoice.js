import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema(
  {
    workSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkSession' },
    description: { type: String },
    hours: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    number: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    currency: { type: String, default: 'INR' },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    taxPercent: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    pdfPath: { type: String },
    status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', invoiceSchema);


