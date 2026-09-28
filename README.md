# 🚧 PotholeX – Smart Pothole Detection, Reporting & Resolution

> **Tagline:** Report. Route. Resolve. Verify.  
> **Subtitle:** Smart Pothole Detection, Reporting & Resolution

---

## 📌 Overview

**PotholeX** is an iOS-inspired, modern civic-tech platform for citizen photo + GPS pothole reporting, automatic ward routing, 24-hour SLA tracking, automated escalations, and closed-loop citizen verification.

Instead of building a simple CRUD website, RoadPulse models an intelligent, transparent, and accountable municipal workflow:
```
Detect → Verify → Prioritize → Route → Acknowledge → Resolve → Verify → Close
                                   │
                      (If SLA Breached) → Automatic Escalation 🚨
```

---

## 🛠️ Technology Stack

- **Frontend:** React.js (Vite), Tailwind CSS v4, Framer Motion, Lucide React icons, Leaflet / React-Leaflet maps, Axios, Canvas Confetti.
- **Backend:** Node.js, Express.js, REST APIs.
- **Database:** **PostgreSQL** (`pg`) with automatic schema initialization & seeding.
  - **Credentials:** Username `postgres`, Password `postgres`, Host `localhost`, Port `5432`, Database `roadpulse`.
  - *Fallback Engine:* Includes a built-in high-speed In-Memory data store fallback if the PostgreSQL service is offline during a presentation.

---

## 👤 User Roles & Demo Accounts

The application includes a quick role switcher in the top navigation bar:

1. 👤 **Citizen (Raghav Sharma):**
   - **Email:** `citizen@roadpulse.demo`
   - **Features:** Report potholes with camera/GPS, check nearby duplicate issues, view AI risk score & explainable priority reasons, track live SLA timers, confirm closed-loop repair verifications (+50 Civic Impact Points).
2. 👷 **Engineer / Ward Officer (Amit Patil - Ward 12):**
   - **Email:** `engineer@roadpulse.demo`
   - **Features:** Priority queue with filter chips, live ward map, acknowledge work orders, upload Before/After proof photos, manual/automatic SLA breach triggers.
3. 🛡️ **Admin Command Center:**
   - **Email:** `admin@roadpulse.demo`
   - **Features:** City-wide executive dashboard, live interactive map with **Risk Heatmap overlay**, ward SLA compliance progress bars, AI Road Risk prediction analytics.

---

## ⚡ How to Run the Application

### Step 1: PostgreSQL Setup (Optional but Recommended)

1. Open PostgreSQL command line (`psql`) or pgAdmin.
2. Connect with username `postgres` and password `postgres`:
   ```sql
   CREATE DATABASE roadpulse;
   ```
3. The server will automatically connect, create the required tables (`users`, `potholes`, `notifications`), and seed realistic demo pothole data.
*(Note: If PostgreSQL is not installed or the database is not created, RoadPulse will automatically run in high-speed Standalone Demo Mode).*

---

### Step 2: Start Backend Server

1. Open terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   *Backend API will run at:* `http://localhost:5000`

---

### Step 3: Start Frontend Client

1. Open a second terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser at:
   👉 `http://localhost:5173`

---

## 📡 REST API Summary

- `POST /api/auth/login` — Switch active demo role
- `GET /api/potholes` — Fetch all potholes (supports `status`, `ward`, `severity` filters)
- `GET /api/potholes/:id` — Fetch single complaint details
- `POST /api/potholes` — Submit new report (AI risk calculation & automatic ward routing)
- `PUT /api/potholes/:id` — Update status / work order
- `POST /api/potholes/:id/support` — Support an existing report (+1 priority boost)
- `POST /api/potholes/check-duplicates` — Check for nearby duplicate reports within ~45m
- `POST /api/potholes/:id/escalate` — Trigger SLA breach escalation
- `POST /api/verification` — Submit citizen repair verification (`VERIFIED` vs `REOPENED`)
- `GET /api/analytics/dashboard` — Command center metrics & ward performance
- `POST /api/analytics/predict-risk` — AI Road Risk prediction forecast

---

## 📄 License & Hackathon Prototype Notice

PotholeX  is built as a civic-tech prototype demonstrating smart municipal road management, SLA accountability, and citizen verification.
