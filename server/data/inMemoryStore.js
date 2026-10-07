import { SEED_POTHOLES, DEMO_USERS } from '../seed/demoData.js';
import { calculateRiskScore, findWardByCoordinates, detectNearbyDuplicates } from '../services/smartEngine.js';

class InMemoryStore {
  constructor() {
    this.potholes = JSON.parse(JSON.stringify(SEED_POTHOLES));
    this.users = JSON.parse(JSON.stringify(DEMO_USERS));
    this.notifications = [
      {
        id: "notif-1",
        userId: "citizen@roadpulse.demo",
        recipientRole: "Citizen",
        title: "Pothole Acknowledged",
        message: "Your complaint PT-1048 has been assigned to Ward Engineer Amit Patil.",
        type: "INFO",
        potholeId: "PT-1048",
        read: false,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: "notif-2",
        userId: "citizen@roadpulse.demo",
        recipientRole: "Citizen",
        title: "Repair Completed — Verification Required",
        message: "Ward 12 crew has marked complaint PT-1055 as Resolved. Please verify the repair.",
        type: "VERIFICATION",
        potholeId: "PT-1055",
        read: false,
        createdAt: new Date(Date.now() - 1800000)
      },
      {
        id: "notif-3",
        userId: "engineer@roadpulse.demo",
        recipientRole: "Engineer",
        title: "SLA Breach Alert",
        message: "Complaint PT-1098 has breached the 24-hour resolution SLA and escalated to Commissioner.",
        type: "ESCALATION",
        potholeId: "PT-1098",
        read: false,
        createdAt: new Date(Date.now() - 7200000)
      }
    ];
  }

  getPotholes(query = {}) {
    let result = [...this.potholes];
    if (query.status) {
      if (query.status === 'Open') {
        result = result.filter(p => ['Reported', 'Verified', 'Assigned', 'Acknowledged', 'In Progress', 'Reopened', 'Escalated'].includes(p.status));
      } else {
        result = result.filter(p => p.status === query.status);
      }
    }
    if (query.ward) {
      result = result.filter(p => p.ward.toLowerCase().includes(query.ward.toLowerCase()));
    }
    if (query.severity) {
      result = result.filter(p => p.severity === query.severity);
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getPotholeById(id) {
    return this.potholes.find(p => p.complaintId === id || p._id === id);
  }

  createPothole(data) {
    const lat = Number(data.latitude) || 16.8544;
    const lng = Number(data.longitude) || 74.5642;

    // Ward Identification
    const wardObj = findWardByCoordinates(lat, lng);
    const wardName = wardObj.name;
    const department = wardObj.department;
    const engineer = wardObj.primaryEngineer;

    // Risk Calculation
    const riskAnalysis = calculateRiskScore({
      estimatedSize: data.estimatedSize || 'Large',
      trafficRisk: data.trafficRisk || 'HIGH',
      roadType: data.roadType || 'Main Arterial Road',
      sensitiveLocation: data.sensitiveLocation || 'School & Hospital Zone (<100m)',
      supportCount: 1
    });

    const complaintId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const ackSla = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const resSla = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const newPothole = {
      complaintId,
      title: data.title || `Pothole Report near ${data.address || 'Detected Location'}`,
      description: data.description || 'Pothole detected via Citizen Mobile Reporting flow.',
      image: data.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      latitude: lat,
      longitude: lng,
      address: data.address || 'Detected GPS Location',
      ward: wardName,
      department: department,
      severity: riskAnalysis.severity,
      riskScore: riskAnalysis.riskScore,
      priorityReasons: riskAnalysis.priorityReasons,
      status: 'Assigned',
      reportedBy: data.reportedBy || { name: 'Raghav Sharma', email: 'citizen@roadpulse.demo', phone: '+91 98765 43210' },
      assignedEngineer: engineer,
      supportCount: 1,
      supporters: [data.reportedBy?.email || 'citizen@roadpulse.demo'],
      acknowledgementSlaDeadline: ackSla,
      resolutionSlaDeadline: resSla,
      escalationLevel: 0,
      escalationHistory: [],
      createdAt: now
    };

    this.potholes.unshift(newPothole);

    // Push notification to Engineer & Citizen
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: engineer.email,
      recipientRole: 'Engineer',
      title: 'New High Priority Pothole Assigned',
      message: `${complaintId} assigned to your ward with Risk Score ${riskAnalysis.riskScore}/100.`,
      type: 'INFO',
      potholeId: complaintId,
      read: false,
      createdAt: now
    });

    return newPothole;
  }

  updatePothole(id, updates) {
    const index = this.potholes.findIndex(p => p.complaintId === id || p._id === id);
    if (index === -1) return null;

    const current = this.potholes[index];
    const updated = { ...current, ...updates };

    // If marking as acknowledged
    if (updates.status === 'Acknowledged' && !current.acknowledgedAt) {
      updated.acknowledgedAt = new Date();
    }
    // If starting repair
    if (updates.status === 'In Progress' && !current.startedAt) {
      updated.startedAt = new Date();
    }
    // If resolved
    if (updates.status === 'Resolved' && !current.resolvedAt) {
      updated.resolvedAt = new Date();
      // Notify citizen
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: current.reportedBy.email || 'citizen@roadpulse.demo',
        recipientRole: 'Citizen',
        title: 'Repair Completed — Action Needed',
        message: `Pothole ${current.complaintId} has been repaired. Please verify and confirm resolution.`,
        type: 'VERIFICATION',
        potholeId: current.complaintId,
        read: false,
        createdAt: new Date()
      });
    }
    // If closed
    if (updates.status === 'Closed') {
      updated.closedAt = new Date();
    }

    this.potholes[index] = updated;
    return updated;
  }

  supportPothole(id, userEmail = 'citizen@roadpulse.demo') {
    const pothole = this.getPotholeById(id);
    if (!pothole) return null;

    if (!pothole.supporters) pothole.supporters = [];
    if (!pothole.supporters.includes(userEmail)) {
      pothole.supporters.push(userEmail);
      pothole.supportCount = (pothole.supportCount || 1) + 1;

      // Re-evaluate risk score
      const reCalc = calculateRiskScore({
        estimatedSize: pothole.estimatedSize,
        trafficRisk: pothole.trafficRisk,
        roadType: pothole.roadType,
        sensitiveLocation: pothole.sensitiveLocation,
        supportCount: pothole.supportCount,
        isReopened: pothole.status === 'Reopened'
      });
      pothole.riskScore = reCalc.riskScore;
      pothole.severity = reCalc.severity;
      pothole.priorityReasons = reCalc.priorityReasons;
    }
    return pothole;
  }

  triggerEscalation(id, manualReason = null) {
    const pothole = this.getPotholeById(id);
    if (!pothole) return null;

    pothole.status = 'Escalated';
    pothole.escalationLevel = (pothole.escalationLevel || 0) + 1;
    if (!pothole.escalationHistory) pothole.escalationHistory = [];

    const level = pothole.escalationLevel;
    const escalatedTo = level === 1 ? "Sanjay Deshmukh (Executive Engineer)" : "R. K. Kadam (Ward Commissioner)";
    const reason = manualReason || (level === 1 ? "Acknowledgement SLA Exceeded" : "24-Hour Resolution SLA Breached");

    pothole.escalationHistory.push({
      level,
      escalatedTo,
      reason,
      timestamp: new Date()
    });

    pothole.riskScore = Math.min(100, pothole.riskScore + 10);
    pothole.severity = 'CRITICAL';
    if (!pothole.priorityReasons.includes('Automatic Priority Escalation Triggered')) {
      pothole.priorityReasons.unshift('Automatic Priority Escalation Triggered');
    }

    // Notify Admin and Engineer
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: 'admin@roadpulse.demo',
      recipientRole: 'Admin',
      title: `⚠️ SLA BREACH ESCALATION: ${pothole.complaintId}`,
      message: `Complaint ${pothole.complaintId} in ${pothole.ward} breached SLA. Escalated to ${escalatedTo}.`,
      type: 'ESCALATION',
      potholeId: pothole.complaintId,
      read: false,
      createdAt: new Date()
    });

    return pothole;
  }

  verifyRepair(id, result, comment) {
    const pothole = this.getPotholeById(id);
    if (!pothole) return null;

    pothole.verificationResult = result;
    pothole.verificationComment = comment;

    if (result === 'VERIFIED') {
      pothole.status = 'Closed';
      pothole.closedAt = new Date();
    } else {
      // Reopened!
      pothole.status = 'Reopened';
      pothole.escalationLevel = (pothole.escalationLevel || 0) + 1;
      pothole.riskScore = Math.min(100, pothole.riskScore + 15);
      pothole.severity = 'CRITICAL';
      pothole.priorityReasons.unshift('Citizen Rejected Repair — Reopened with High Urgency');

      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: pothole.assignedEngineer?.email || 'engineer@roadpulse.demo',
        recipientRole: 'Engineer',
        title: `🚨 Repair Rejected & Reopened: ${pothole.complaintId}`,
        message: `Citizen reported pothole still exists. Comment: "${comment || 'No comment'}". Urgent revisit required!`,
        type: 'WARNING',
        potholeId: pothole.complaintId,
        read: false,
        createdAt: new Date()
      });
    }
    return pothole;
  }

  getNotifications(userId, role) {
    return this.notifications.filter(n =>
      n.userId === userId || n.recipientRole === role || n.recipientRole === 'All'
    );
  }

  markNotificationRead(notifId) {
    const notif = this.notifications.find(n => n.id === notifId);
    if (notif) notif.read = true;
    return notif;
  }

  getAnalytics() {
    const total = this.potholes.length;
    const open = this.potholes.filter(p => ['Reported', 'Verified', 'Assigned', 'Acknowledged', 'In Progress', 'Reopened'].includes(p.status)).length;
    const resolved = this.potholes.filter(p => ['Resolved', 'Closed'].includes(p.status)).length;
    const escalated = this.potholes.filter(p => p.status === 'Escalated' || p.escalationLevel > 0).length;

    const wards = [
      { name: "Ward 12 - Central Zone", compliance: 92, count: 12, resolved: 10 },
      { name: "Ward 8 - North Zone", compliance: 81, count: 6, resolved: 4 },
      { name: "Ward 5 - South Zone", compliance: 72, count: 4, resolved: 2 },
      { name: "Ward 3 - East Zone", compliance: 88, count: 3, resolved: 2 }
    ];

    return {
      total,
      open,
      resolved,
      escalated,
      avgResolutionHours: 4.2,
      slaComplianceRate: 88.5,
      wardPerformance: wards
    };
  }
}

export const inMemoryStore = new InMemoryStore();
