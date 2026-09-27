import mongoose from 'mongoose';

const potholeSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, default: 'MG Road, Central Ward' },
  ward: { type: String, default: 'Ward 12 - Central Zone' },
  department: { type: String, default: 'Road Maintenance & Civil Works' },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  riskScore: { type: Number, default: 75 },
  estimatedSize: { type: String, default: 'Large (approx. 1.2m x 0.8m)' },
  trafficRisk: { type: String, default: 'HIGH' },
  roadType: { type: String, default: 'Main Arterial Road' },
  sensitiveLocation: { type: String, default: 'School & Hospital Zone (<100m)' },
  priorityReasons: [{ type: String }],
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'Assigned', 'Acknowledged', 'In Progress', 'Resolved', 'Reopened', 'Escalated', 'Closed'],
    default: 'Assigned'
  },
  reportedBy: {
    name: { type: String, default: 'Raghav Sharma' },
    email: { type: String, default: 'citizen@roadpulse.demo' },
    phone: { type: String, default: '+91 98765 43210' }
  },
  assignedEngineer: {
    name: { type: String, default: 'Amit Patil' },
    email: { type: String, default: 'engineer@roadpulse.demo' },
    role: { type: String, default: 'Ward Engineer - Ward 12' }
  },
  supportCount: { type: Number, default: 1 },
  supporters: [{ type: String }],
  acknowledgementSlaDeadline: { type: Date },
  resolutionSlaDeadline: { type: Date },
  acknowledgedAt: { type: Date },
  startedAt: { type: Date },
  resolvedAt: { type: Date },
  closedAt: { type: Date },
  escalationLevel: { type: Number, default: 0 },
  escalationHistory: [{
    level: Number,
    escalatedTo: String,
    reason: String,
    timestamp: { type: Date, default: Date.now }
  }],
  beforeImage: { type: String },
  afterImage: { type: String },
  repairNotes: { type: String },
  repairType: { type: String, default: 'Hot-Mix Asphalt Patching & Compaction' },
  verificationResult: { type: String }, // 'VERIFIED' or 'REOPENED'
  verificationComment: { type: String },
  isCluster: { type: Boolean, default: false },
  clusterCount: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export const Pothole = mongoose.models.Pothole || mongoose.model('Pothole', potholeSchema);
