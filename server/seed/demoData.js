/**
 * Demo Seed Dataset for RoadPulse Prototype
 * Standard central coordinates centered around lat 16.854, lng 74.564 (Sangli Center)
 */

const now = new Date();
const hoursAgo = (h) => new Date(now.getTime() - h * 60 * 60 * 1000);
const hoursAhead = (h) => new Date(now.getTime() + h * 60 * 60 * 1000);

// High-quality pothole images for demo
export const SAMPLE_POTHOLE_IMAGES = {
  pothole1: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  pothole2: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  pothole3: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
  pothole4: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
  beforeRepair: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
  afterRepair: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
};

export const SEED_POTHOLES = [
  {
    complaintId: "PT-1048",
    title: "Critical Deep Crater near City High School",
    description: "Extremely severe pothole causing major traffic slowdown and two-wheeler skidding risk right outside school gate.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8551,
    longitude: 74.5643,
    address: "Miraj Road, near Sangli High School, Sangli",
    ward: "Ward 12 - Central Zone",
    department: "Central Road Maintenance & Pavement Division",
    severity: "CRITICAL",
    riskScore: 91,
    estimatedSize: "Large (approx. 1.4m x 1.1m, depth 12cm)",
    trafficRisk: "HIGH",
    roadType: "Main Arterial Road",
    sensitiveLocation: "St. Xavier School (<50m)",
    priorityReasons: [
      "Large Deep Crater (>10cm depth)",
      "Main Arterial Commuter Route",
      "14 Citizen Reports Clustered",
      "High School Zone within 50 meters",
      "High Peak-Hour Bus Density"
    ],
    status: "Assigned",
    reportedBy: { name: "Raghav Sharma", email: "citizen@roadpulse.demo", phone: "+91 98765 43210" },
    assignedEngineer: { name: "Amit Patil", email: "engineer@roadpulse.demo", role: "Senior Ward Engineer - Ward 12" },
    supportCount: 14,
    supporters: ["citizen@roadpulse.demo", "priya.k@gmail.com", "sunil.m@gmail.com", "vikram.s@gmail.com"],
    acknowledgementSlaDeadline: hoursAhead(2),
    resolutionSlaDeadline: hoursAhead(18),
    escalationLevel: 0,
    escalationHistory: [],
    isCluster: true,
    clusterCount: 14,
    createdAt: hoursAgo(2)
  },
  {
    complaintId: "PT-1098",
    title: "SLA Breached - Heavy Road Rupture at Market Chowk",
    description: "Massive asphalt rupture left unaddressed beyond 24-hour SLA window. Escalated automatically to Senior Engineer & Ward Administrator.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8601,
    longitude: 74.5681,
    address: "Rajwada Chowk, near Sangli Market Yard",
    ward: "Ward 12 - Central Zone",
    department: "Central Road Maintenance & Pavement Division",
    severity: "CRITICAL",
    riskScore: 96,
    estimatedSize: "Severe Trench (2.1m x 0.9m)",
    trafficRisk: "HIGH",
    roadType: "Commercial Market Road",
    sensitiveLocation: "District General Hospital (<120m)",
    priorityReasons: [
      "24-Hour Resolution SLA Breached",
      "Automatic Priority Escalation Triggered",
      "Hospital Emergency Ambulance Route",
      "22 Citizen Reports Clustered",
      "Commercial District Hotspot"
    ],
    status: "Escalated",
    reportedBy: { name: "Ananya Deshmukh", email: "ananya.d@demo.com", phone: "+91 98111 22334" },
    assignedEngineer: { name: "Amit Patil", email: "engineer@roadpulse.demo", role: "Senior Ward Engineer - Ward 12" },
    supportCount: 22,
    supporters: ["ananya.d@demo.com", "citizen@roadpulse.demo"],
    acknowledgementSlaDeadline: hoursAgo(20),
    resolutionSlaDeadline: hoursAgo(2),
    escalationLevel: 2,
    escalationHistory: [
      {
        level: 1,
        escalatedTo: "Sanjay Deshmukh (Executive Engineer)",
        reason: "Acknowledgement SLA Exceeded by Ward Engineer",
        timestamp: hoursAgo(6)
      },
      {
        level: 2,
        escalatedTo: "R. K. Kadam (Ward Commissioner)",
        reason: "Resolution Deadline 24h Exceeded",
        timestamp: hoursAgo(2)
      }
    ],
    isCluster: true,
    clusterCount: 22,
    createdAt: hoursAgo(26)
  },
  {
    complaintId: "PT-1032",
    title: "Hazardous Pothole near Railway Station South Exit",
    description: "Dangerous cavity formed after heavy monsoon runoff, damaging wheels during night hours.",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8660,
    longitude: 74.5609,
    address: "Sangli Railway Station Road, South Exit",
    ward: "Ward 8 - North Zone",
    department: "North Highway & Urban Infrastructure Works",
    severity: "HIGH",
    riskScore: 78,
    estimatedSize: "Medium (0.9m x 0.7m)",
    trafficRisk: "HIGH",
    roadType: "Station Connecting Road",
    sensitiveLocation: "Transit Railway Hub",
    priorityReasons: [
      "Transit Corridor High Density",
      "Night Visibility Hazard",
      "8 Citizen Reports"
    ],
    status: "In Progress",
    reportedBy: { name: "Suresh Joshi", email: "suresh.j@demo.com" },
    assignedEngineer: { name: "Rajesh Sharma", email: "rajesh.sharma@roadpulse.demo", role: "Ward Engineer - Ward 8" },
    supportCount: 8,
    acknowledgedAt: hoursAgo(4),
    startedAt: hoursAgo(1),
    acknowledgementSlaDeadline: hoursAgo(1),
    resolutionSlaDeadline: hoursAhead(6),
    escalationLevel: 0,
    createdAt: hoursAgo(7)
  },
  {
    complaintId: "PT-1055",
    title: "Repaired Pothole Pending Citizen Confirmation",
    description: "Hot-mix asphalt patching completed by Ward 12 crew. Citizen verification request sent to reported users.",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8521,
    longitude: 74.5712,
    address: "Rajaram Puri 5th Lane, Sangli",
    ward: "Ward 12 - Central Zone",
    department: "Central Road Maintenance & Pavement Division",
    severity: "HIGH",
    riskScore: 82,
    estimatedSize: "Large Patch (1.5m x 1.0m)",
    trafficRisk: "MEDIUM",
    roadType: "Residential Collector Road",
    sensitiveLocation: "Community Park",
    priorityReasons: [
      "Repair Completed — Pending Citizen Confirmation",
      "Proof of Work Uploaded by Engineer"
    ],
    status: "Resolved",
    reportedBy: { name: "Raghav Sharma", email: "citizen@roadpulse.demo" },
    assignedEngineer: { name: "Amit Patil", email: "engineer@roadpulse.demo" },
    supportCount: 6,
    acknowledgedAt: hoursAgo(10),
    startedAt: hoursAgo(5),
    resolvedAt: hoursAgo(1),
    beforeImage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    repairNotes: "Excavated loose bitumen base, refilled with sub-grade gravel, applied hot bitumen binder and rolled with 3-ton roller.",
    repairType: "Hot-Mix Asphalt Patching & Compaction",
    acknowledgementSlaDeadline: hoursAgo(8),
    resolutionSlaDeadline: hoursAhead(14),
    escalationLevel: 0,
    createdAt: hoursAgo(12)
  },
  {
    complaintId: "PT-1018",
    title: "Closed & Verified Pothole — Shahupuri 2nd Lane",
    description: "Successfully repaired and verified by citizen Raghav Sharma.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8576,
    longitude: 74.5730,
    address: "Shahupuri 2nd Lane, Sangli",
    ward: "Ward 12 - Central Zone",
    department: "Central Road Maintenance & Pavement Division",
    severity: "MEDIUM",
    riskScore: 52,
    estimatedSize: "Medium",
    status: "Closed",
    reportedBy: { name: "Raghav Sharma", email: "citizen@roadpulse.demo" },
    assignedEngineer: { name: "Amit Patil", email: "engineer@roadpulse.demo" },
    supportCount: 4,
    beforeImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    repairNotes: "Full depth asphalt patch completed.",
    verificationResult: "VERIFIED",
    verificationComment: "Smooth road restored! Great job by Ward 12 team.",
    resolvedAt: hoursAgo(18),
    closedAt: hoursAgo(14),
    createdAt: hoursAgo(30)
  },
  {
    complaintId: "PT-1077",
    title: "Suburban Fissure near Cyber City Gate 2",
    description: "Cracked asphalt segment forming waterlogged trench after rainfall.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8490,
    longitude: 74.5580,
    address: "Vishrambag Ring Road, South Sangli",
    ward: "Ward 5 - South Zone",
    department: "South Suburb Asphalt & Repair Section",
    severity: "HIGH",
    riskScore: 68,
    estimatedSize: "Medium (1.0m x 0.6m)",
    trafficRisk: "MEDIUM",
    roadType: "IT Park Main Road",
    sensitiveLocation: "Tech Park & Office Hub",
    priorityReasons: [
      "High Tech Park Traffic",
      "Waterlogging Hazard",
      "5 Citizen Supports"
    ],
    status: "Acknowledged",
    reportedBy: { name: "Nikhil Varma", email: "nikhil.v@demo.com" },
    assignedEngineer: { name: "Priya Nair", email: "priya.nair@roadpulse.demo", role: "Ward Engineer - Ward 5" },
    supportCount: 5,
    acknowledgedAt: hoursAgo(1),
    acknowledgementSlaDeadline: hoursAgo(0.5),
    resolutionSlaDeadline: hoursAhead(16),
    createdAt: hoursAgo(3)
  },
  {
    complaintId: "PT-1082",
    title: "Pothole near East Ring Bus Stop",
    description: "Edge crumble on bus bay causing passengers to trip during boarding.",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    latitude: 16.8565,
    longitude: 74.5800,
    address: "Sangli-Miraj Link Road, Bus Stop #4",
    ward: "Ward 3 - East Zone",
    department: "East Commercial Arterial Roads Section",
    severity: "MEDIUM",
    riskScore: 54,
    estimatedSize: "Small to Medium",
    status: "Assigned",
    reportedBy: { name: "Sneha Patel", email: "sneha.p@demo.com" },
    assignedEngineer: { name: "Vikas Gaikwad", email: "vikas.gaikwad@roadpulse.demo" },
    supportCount: 3,
    acknowledgementSlaDeadline: hoursAhead(3),
    resolutionSlaDeadline: hoursAhead(21),
    createdAt: hoursAgo(1)
  }
];

export const DEMO_USERS = [
  {
    name: "Raghav Sharma",
    email: "citizen@roadpulse.demo",
    phone: "+91 98765 43210",
    role: "Citizen",
    ward: "Ward 12 - Central Zone",
    impactScore: 420,
    reportsSubmitted: 8,
    repairsVerified: 12
  },
  {
    name: "Amit Patil",
    email: "engineer@roadpulse.demo",
    phone: "+91 98230 11223",
    role: "Engineer",
    ward: "Ward 12 - Central Zone"
  },
  {
    name: "Admin Control Center",
    email: "admin@roadpulse.demo",
    phone: "+91 98000 00000",
    role: "Admin",
    ward: "City Command Center"
  }
];
