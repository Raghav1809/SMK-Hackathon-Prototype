import mongoose from 'mongoose';

const workOrderSchema = new mongoose.Schema({
  potholeId: { type: String, required: true },
  engineerId: { type: String, required: true },
  engineerName: { type: String, default: 'Amit Patil' },
  assignedAt: { type: Date, default: Date.now },
  acknowledgedAt: { type: Date },
  startedAt: { type: Date },
  resolvedAt: { type: Date },
  beforeImage: { type: String },
  afterImage: { type: String },
  repairNotes: { type: String },
  repairType: { type: String },
  status: { type: String, enum: ['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REOPENED'], default: 'ASSIGNED' }
});

export const WorkOrder = mongoose.models.WorkOrder || mongoose.model('WorkOrder', workOrderSchema);
