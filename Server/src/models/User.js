import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'client'], default: 'freelancer' },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // For client role users
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


