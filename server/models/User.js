import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['Citizen', 'Engineer', 'Admin'], default: 'Citizen' },
  ward: { type: String, default: 'Ward 12' },
  impactScore: { type: Number, default: 0 },
  reportsSubmitted: { type: Number, default: 0 },
  repairsVerified: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
