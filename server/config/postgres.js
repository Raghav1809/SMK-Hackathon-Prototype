import pg from 'pg';
import dotenv from 'dotenv';
import { SEED_POTHOLES, DEMO_USERS } from '../seed/demoData.js';

dotenv.config();

const { Pool } = pg;

export const PG_CONFIG = {
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'roadpulse',
  connectionTimeoutMillis: 2000,
};

export const pgPool = new Pool(PG_CONFIG);

let isPostgresConnected = false;

export async function initPostgres() {
  try {
    const client = await pgPool.connect();
    console.log('✅ Connected to PostgreSQL database successfully (user: postgres).');
    isPostgresConnected = true;

    // Create Tables Schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        role VARCHAR(50) DEFAULT 'Citizen',
        ward VARCHAR(255) DEFAULT 'Ward 12 - Central Zone',
        impact_score INT DEFAULT 0,
        reports_submitted INT DEFAULT 0,
        repairs_verified INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS potholes (
        id SERIAL PRIMARY KEY,
        complaint_id VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image TEXT,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        address VARCHAR(255),
        ward VARCHAR(255),
        department VARCHAR(255),
        severity VARCHAR(50) DEFAULT 'HIGH',
        risk_score INT DEFAULT 75,
        estimated_size VARCHAR(255),
        traffic_risk VARCHAR(50),
        road_type VARCHAR(255),
        sensitive_location VARCHAR(255),
        priority_reasons JSONB,
        status VARCHAR(50) DEFAULT 'Assigned',
        reported_by JSONB,
        assigned_engineer JSONB,
        support_count INT DEFAULT 1,
        supporters JSONB,
        acknowledgement_sla_deadline TIMESTAMP,
        resolution_sla_deadline TIMESTAMP,
        acknowledged_at TIMESTAMP,
        started_at TIMESTAMP,
        resolved_at TIMESTAMP,
        closed_at TIMESTAMP,
        escalation_level INT DEFAULT 0,
        escalation_history JSONB,
        before_image TEXT,
        after_image TEXT,
        repair_notes TEXT,
        repair_type VARCHAR(255),
        verification_result VARCHAR(50),
        verification_comment TEXT,
        is_cluster BOOLEAN DEFAULT FALSE,
        cluster_count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        recipient_role VARCHAR(50) DEFAULT 'Citizen',
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'INFO',
        pothole_id VARCHAR(50),
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed data if potholes table is empty
    const checkRes = await client.query('SELECT COUNT(*) FROM potholes');
    if (parseInt(checkRes.rows[0].count) === 0) {
      console.log('🌱 Seeding PostgreSQL database with initial demo potholes...');
      for (const p of SEED_POTHOLES) {
        await client.query(
          `INSERT INTO potholes (
            complaint_id, title, description, image, latitude, longitude, address, ward, department,
            severity, risk_score, estimated_size, traffic_risk, road_type, sensitive_location,
            priority_reasons, status, reported_by, assigned_engineer, support_count, supporters,
            acknowledgement_sla_deadline, resolution_sla_deadline, escalation_level, escalation_history,
            before_image, after_image, repair_notes, repair_type, created_at
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30)`,
          [
            p.complaintId, p.title, p.description, p.image, p.latitude, p.longitude, p.address, p.ward, p.department,
            p.severity, p.riskScore, p.estimatedSize, p.trafficRisk, p.roadType, p.sensitiveLocation,
            JSON.stringify(p.priorityReasons), p.status, JSON.stringify(p.reportedBy), JSON.stringify(p.assignedEngineer),
            p.supportCount || 1, JSON.stringify(p.supporters || []),
            p.acknowledgementSlaDeadline, p.resolutionSlaDeadline, p.escalationLevel || 0, JSON.stringify(p.escalationHistory || []),
            p.beforeImage || null, p.afterImage || null, p.repairNotes || null, p.repairType || null, p.createdAt
          ]
        );
      }
      console.log('✅ PostgreSQL seeding complete.');
    }

    client.release();
    return true;
  } catch (err) {
    console.log(`⚠️ PostgreSQL connection warning: ${err.message}`);
    console.log('ℹ️ Server operating with seamless fallback to In-Memory Demo Store.');
    isPostgresConnected = false;
    return false;
  }
}

export function getIsPostgresConnected() {
  return isPostgresConnected;
}
