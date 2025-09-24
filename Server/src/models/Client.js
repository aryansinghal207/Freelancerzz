import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    defaultHourlyRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Client', clientSchema);


