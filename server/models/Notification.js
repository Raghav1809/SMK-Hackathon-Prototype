import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  recipientRole: { type: String, enum: ['Citizen', 'Engineer', 'Admin', 'All'], default: 'Citizen' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'ESCALATION', 'VERIFICATION'], default: 'INFO' },
  potholeId: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
