import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPostgres, pgPool, getIsPostgresConnected } from './config/postgres.js';
import { inMemoryStore } from './data/inMemoryStore.js';
import { calculateRiskScore, findWardByCoordinates, detectNearbyDuplicates } from './services/smartEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize PostgreSQL Connection
initPostgres();

// Helper to format PostgreSQL row to frontend pothole object
function mapPgRowToPothole(row) {
  return {
    id: row.id,
    complaintId: row.complaint_id,
    title: row.title,
    description: row.description,
    image: row.image,
    latitude: row.latitude,
    longitude: row.longitude,
    address: row.address,
    ward: row.ward,
    department: row.department,
    severity: row.severity,
    riskScore: row.risk_score,
    estimatedSize: row.estimated_size,
    trafficRisk: row.traffic_risk,
    roadType: row.road_type,
    sensitiveLocation: row.sensitive_location,
    priorityReasons: typeof row.priority_reasons === 'string' ? JSON.parse(row.priority_reasons) : row.priority_reasons || [],
    status: row.status,
    reportedBy: typeof row.reported_by === 'string' ? JSON.parse(row.reported_by) : row.reported_by || {},
    assignedEngineer: typeof row.assigned_engineer === 'string' ? JSON.parse(row.assigned_engineer) : row.assigned_engineer || {},
    supportCount: row.support_count,
    supporters: typeof row.supporters === 'string' ? JSON.parse(row.supporters) : row.supporters || [],
    acknowledgementSlaDeadline: row.acknowledgement_sla_deadline,
    resolutionSlaDeadline: row.resolution_sla_deadline,
    acknowledgedAt: row.acknowledged_at,
    startedAt: row.started_at,
    resolvedAt: row.resolved_at,
    closedAt: row.closed_at,
    escalationLevel: row.escalation_level,
    escalationHistory: typeof row.escalation_history === 'string' ? JSON.parse(row.escalation_history) : row.escalation_history || [],
    beforeImage: row.before_image,
    afterImage: row.after_image,
    repairNotes: row.repair_notes,
    repairType: row.repair_type,
    verificationResult: row.verification_result,
    verificationComment: row.verification_comment,
    createdAt: row.created_at
  };
}

// REST APIs

// 1. Auth / Demo Role Login
app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  if (role === 'Engineer') {
    return res.json({
      success: true,
      user: {
        name: 'Amit Patil',
        email: 'engineer@roadpulse.demo',
        role: 'Engineer',
        ward: 'Ward 12 - Central Zone'
      }
    });
  } else if (role === 'Admin') {
    return res.json({
      success: true,
      user: {
        name: 'Command Officer',
        email: 'admin@roadpulse.demo',
        role: 'Admin',
        ward: 'City Command Center'
      }
    });
  } else {
    return res.json({
      success: true,
      user: {
        name: 'Raghav Sharma',
        email: 'citizen@roadpulse.demo',
        role: 'Citizen',
        ward: 'Ward 12 - Central Zone',
        impactScore: 420,
        reportsSubmitted: 8,
        repairsVerified: 12
      }
    });
  }
});

// 2. Get All Potholes
app.get('/api/potholes', async (req, res) => {
  const { status, ward, severity } = req.query;

  if (getIsPostgresConnected()) {
    try {
      let query = 'SELECT * FROM potholes WHERE 1=1';
      const params = [];
      if (status) {
        if (status === 'Open') {
          query += ` AND status IN ('Reported', 'Verified', 'Assigned', 'Acknowledged', 'In Progress', 'Reopened', 'Escalated')`;
        } else {
          params.push(status);
          query += ` AND status = $${params.length}`;
        }
      }
      if (ward) {
        params.push(`%${ward}%`);
        query += ` AND ward ILIKE $${params.length}`;
      }
      if (severity) {
        params.push(severity);
        query += ` AND severity = $${params.length}`;
      }
      query += ' ORDER BY created_at DESC';

      const result = await pgPool.query(query, params);
      const potholes = result.rows.map(mapPgRowToPothole);
      return res.json({ success: true, count: potholes.length, potholes, db: 'PostgreSQL' });
    } catch (err) {
      console.warn('PG fetch error, using in-memory fallback:', err.message);
    }
  }

  // Fallback to In-Memory Store
  const potholes = inMemoryStore.getPotholes({ status, ward, severity });
  return res.json({ success: true, count: potholes.length, potholes, db: 'InMemoryFallback' });
});

// 3. Get Single Pothole Details
app.get('/api/potholes/:id', async (req, res) => {
  if (getIsPostgresConnected()) {
    try {
      const result = await pgPool.query('SELECT * FROM potholes WHERE complaint_id = $1', [req.params.id]);
      if (result.rows.length > 0) {
        return res.json({ success: true, pothole: mapPgRowToPothole(result.rows[0]) });
      }
    } catch (err) {}
  }
  const pothole = inMemoryStore.getPotholeById(req.params.id);
  if (!pothole) return res.status(404).json({ success: false, message: 'Pothole not found' });
  return res.json({ success: true, pothole });
});

// 4. Create New Pothole Report (AI Risk & Ward Routing)
app.post('/api/potholes', async (req, res) => {
  try {
    const lat = Number(req.body.latitude) || 16.6982;
    const lng = Number(req.body.longitude) || 74.2315;

    const wardObj = findWardByCoordinates(lat, lng);
    const riskAnalysis = calculateRiskScore({
      estimatedSize: req.body.estimatedSize || 'Large',
      trafficRisk: req.body.trafficRisk || 'HIGH',
      roadType: req.body.roadType || 'Main Arterial Road',
      sensitiveLocation: req.body.sensitiveLocation || 'School & Hospital Zone (<100m)',
      supportCount: 1
    });

    const complaintId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const ackSla = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const resSla = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const title = req.body.title || `Pothole Report near ${req.body.address || 'Detected Location'}`;
    const description = req.body.description || 'Pothole detected via Citizen Mobile Reporting flow.';
    const image = req.body.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
    const address = req.body.address || 'Detected GPS Location';
    const reportedBy = req.body.reportedBy || { name: 'Raghav Sharma', email: 'citizen@roadpulse.demo', phone: '+91 98765 43210' };

    if (getIsPostgresConnected()) {
      const insertRes = await pgPool.query(
        `INSERT INTO potholes (
          complaint_id, title, description, image, latitude, longitude, address, ward, department,
          severity, risk_score, estimated_size, traffic_risk, road_type, sensitive_location,
          priority_reasons, status, reported_by, assigned_engineer, support_count, supporters,
          acknowledgement_sla_deadline, resolution_sla_deadline, created_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24)
        RETURNING *`,
        [
          complaintId, title, description, image, lat, lng, address, wardObj.name, wardObj.department,
          riskAnalysis.severity, riskAnalysis.riskScore, req.body.estimatedSize || 'Large',
          req.body.trafficRisk || 'HIGH', req.body.roadType || 'Main Arterial Road',
          req.body.sensitiveLocation || 'School Zone', JSON.stringify(riskAnalysis.priorityReasons),
          'Assigned', JSON.stringify(reportedBy), JSON.stringify(wardObj.primaryEngineer),
          1, JSON.stringify([reportedBy.email || 'citizen@roadpulse.demo']),
          ackSla, resSla, now
        ]
      );
      const newPothole = mapPgRowToPothole(insertRes.rows[0]);
      return res.status(201).json({ success: true, pothole: newPothole });
    }

    const newPothole = inMemoryStore.createPothole(req.body);
    return res.status(201).json({ success: true, pothole: newPothole });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Update Pothole Status / Work Order
app.put('/api/potholes/:id', async (req, res) => {
  if (getIsPostgresConnected()) {
    try {
      const { status, beforeImage, afterImage, repairNotes, repairType } = req.body;
      let query = 'UPDATE potholes SET status = $1';
      const params = [status];

      if (status === 'Acknowledged') {
        query += `, acknowledged_at = CURRENT_TIMESTAMP`;
      }
      if (status === 'In Progress') {
        query += `, started_at = CURRENT_TIMESTAMP`;
      }
      if (status === 'Resolved') {
        query += `, resolved_at = CURRENT_TIMESTAMP`;
        if (beforeImage) { params.push(beforeImage); query += `, before_image = $${params.length}`; }
        if (afterImage) { params.push(afterImage); query += `, after_image = $${params.length}`; }
        if (repairNotes) { params.push(repairNotes); query += `, repair_notes = $${params.length}`; }
        if (repairType) { params.push(repairType); query += `, repair_type = $${params.length}`; }
      }
      if (status === 'Closed') {
        query += `, closed_at = CURRENT_TIMESTAMP`;
      }

      params.push(req.params.id);
      query += ` WHERE complaint_id = $${params.length} RETURNING *`;

      const result = await pgPool.query(query, params);
      if (result.rows.length > 0) {
        return res.json({ success: true, pothole: mapPgRowToPothole(result.rows[0]) });
      }
    } catch (err) {}
  }

  const updated = inMemoryStore.updatePothole(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Pothole not found' });
  return res.json({ success: true, pothole: updated });
});

// 6. Support Existing Pothole Report
app.post('/api/potholes/:id/support', async (req, res) => {
  const { userEmail = 'citizen@roadpulse.demo' } = req.body;
  if (getIsPostgresConnected()) {
    try {
      const pRes = await pgPool.query('SELECT * FROM potholes WHERE complaint_id = $1', [req.params.id]);
      if (pRes.rows.length > 0) {
        const row = pRes.rows[0];
        const supporters = typeof row.supporters === 'string' ? JSON.parse(row.supporters) : row.supporters || [];
        if (!supporters.includes(userEmail)) {
          supporters.push(userEmail);
          const newCount = row.support_count + 1;
          const reCalc = calculateRiskScore({
            estimatedSize: row.estimated_size,
            trafficRisk: row.traffic_risk,
            roadType: row.road_type,
            sensitiveLocation: row.sensitive_location,
            supportCount: newCount,
            isReopened: row.status === 'Reopened'
          });

          const upRes = await pgPool.query(
            `UPDATE potholes SET support_count = $1, supporters = $2, risk_score = $3, severity = $4, priority_reasons = $5
             WHERE complaint_id = $6 RETURNING *`,
            [newCount, JSON.stringify(supporters), reCalc.riskScore, reCalc.severity, JSON.stringify(reCalc.priorityReasons), req.params.id]
          );
          return res.json({ success: true, pothole: mapPgRowToPothole(upRes.rows[0]) });
        }
      }
    } catch (err) {}
  }

  const pothole = inMemoryStore.supportPothole(req.params.id, userEmail);
  if (!pothole) return res.status(404).json({ success: false, message: 'Pothole not found' });
  return res.json({ success: true, pothole });
});

// 7. Check Duplicate Reports
app.post('/api/potholes/check-duplicates', async (req, res) => {
  const lat = Number(req.body.latitude);
  const lng = Number(req.body.longitude);
  const potholes = inMemoryStore.getPotholes();
  const duplicates = detectNearbyDuplicates(lat, lng, potholes, 60);

  return res.json({
    success: true,
    hasDuplicates: duplicates.length > 0,
    duplicates
  });
});

// 8. SLA Escalation Trigger
app.post('/api/potholes/:id/escalate', async (req, res) => {
  const { reason = '24-Hour Resolution SLA Breached' } = req.body;

  if (getIsPostgresConnected()) {
    try {
      const pRes = await pgPool.query('SELECT * FROM potholes WHERE complaint_id = $1', [req.params.id]);
      if (pRes.rows.length > 0) {
        const row = pRes.rows[0];
        const newLevel = (row.escalation_level || 0) + 1;
        const history = typeof row.escalation_history === 'string' ? JSON.parse(row.escalation_history) : row.escalation_history || [];
        const escalatedTo = newLevel === 1 ? "Sanjay Deshmukh (Executive Engineer)" : "R. K. Kadam (Ward Commissioner)";

        history.push({ level: newLevel, escalatedTo, reason, timestamp: new Date() });
        const newRisk = Math.min(100, row.risk_score + 10);

        const upRes = await pgPool.query(
          `UPDATE potholes SET status = 'Escalated', escalation_level = $1, escalation_history = $2, risk_score = $3, severity = 'CRITICAL'
           WHERE complaint_id = $4 RETURNING *`,
          [newLevel, JSON.stringify(history), newRisk, req.params.id]
        );
        return res.json({ success: true, pothole: mapPgRowToPothole(upRes.rows[0]) });
      }
    } catch (err) {}
  }

  const pothole = inMemoryStore.triggerEscalation(req.params.id, reason);
  if (!pothole) return res.status(404).json({ success: false, message: 'Pothole not found' });
  return res.json({ success: true, pothole });
});

// 9. Citizen Verification
app.post('/api/verification', async (req, res) => {
  const { potholeId, result, comment } = req.body;

  if (getIsPostgresConnected()) {
    try {
      const newStatus = result === 'VERIFIED' ? 'Closed' : 'Reopened';
      const upRes = await pgPool.query(
        `UPDATE potholes SET status = $1, verification_result = $2, verification_comment = $3, closed_at = $4
         WHERE complaint_id = $5 RETURNING *`,
        [newStatus, result, comment, result === 'VERIFIED' ? new Date() : null, potholeId]
      );
      if (upRes.rows.length > 0) {
        return res.json({ success: true, pothole: mapPgRowToPothole(upRes.rows[0]) });
      }
    } catch (err) {}
  }

  const pothole = inMemoryStore.verifyRepair(potholeId, result, comment);
  if (!pothole) return res.status(404).json({ success: false, message: 'Pothole not found' });
  return res.json({ success: true, pothole });
});

// 10. Notifications
app.get('/api/notifications', (req, res) => {
  const { userId = 'citizen@roadpulse.demo', role = 'Citizen' } = req.query;
  const notifications = inMemoryStore.getNotifications(userId, role);
  return res.json({ success: true, notifications });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notification = inMemoryStore.markNotificationRead(req.params.id);
  return res.json({ success: true, notification });
});

// 11. Command Center Analytics
app.get('/api/analytics/dashboard', (req, res) => {
  const analytics = inMemoryStore.getAnalytics();
  return res.json({ success: true, analytics });
});

app.get('/api/analytics/wards', (req, res) => {
  const analytics = inMemoryStore.getAnalytics();
  return res.json({ success: true, wards: analytics.wardPerformance });
});

app.post('/api/analytics/predict-risk', (req, res) => {
  const { roadName = 'MG Road' } = req.body;
  return res.json({
    success: true,
    prediction: {
      roadName,
      predictedRisk: 'HIGH',
      riskScore: 88,
      factors: [
        'Monsoon Sub-base Saturated',
        'Heavy Goods Vehicle Fleet Route',
        '+37% Complaint Spike Last 30 Days',
        '4 Patch Failures Recorded in 6 Months'
      ],
      recommendation: 'Recommend full structural asphalt resurfacing rather than patch fill.'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 RoadPulse Server listening on http://localhost:${PORT}`);
  console.log(`🐘 Database Driver: PostgreSQL (user: postgres, password: postgres)`);
});
