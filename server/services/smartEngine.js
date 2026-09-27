/**
 * RoadPulse Smart Intelligence Engine
 * Handles Risk Scoring, Ward Routing, Duplicate Clustering & SLA Breach Escalations.
 */

// Simulated Ward Data Registry
export const WARDS_REGISTRY = [
  {
    name: 'Ward 12 - Central Zone',
    bounds: { minLat: 16.690, maxLat: 16.710, minLng: 74.220, maxLng: 74.245 },
    department: 'Central Road Maintenance & Pavement Division',
    primaryEngineer: {
      name: 'Amit Patil',
      email: 'engineer@roadpulse.demo',
      phone: '+91 98230 11223',
      role: 'Senior Ward Engineer'
    },
    seniorOfficer: 'Sanjay Deshmukh (Executive Engineer)',
    wardAdmin: 'R. K. Kadam (Ward Commissioner)'
  },
  {
    name: 'Ward 8 - North Zone',
    bounds: { minLat: 16.710, maxLat: 16.735, minLng: 74.220, maxLng: 74.245 },
    department: 'North Highway & Urban Infrastructure Works',
    primaryEngineer: {
      name: 'Rajesh Sharma',
      email: 'rajesh.sharma@roadpulse.demo',
      phone: '+91 98230 44556',
      role: 'Ward Engineer - Ward 8'
    },
    seniorOfficer: 'Anil Joshi (Deputy Chief Engineer)',
    wardAdmin: 'P. V. Salunkhe (Zonal Officer)'
  },
  {
    name: 'Ward 5 - South Zone',
    bounds: { minLat: 16.665, maxLat: 16.690, minLng: 74.220, maxLng: 74.245 },
    department: 'South Suburb Asphalt & Repair Section',
    primaryEngineer: {
      name: 'Priya Nair',
      email: 'priya.nair@roadpulse.demo',
      phone: '+91 98230 77889',
      role: 'Ward Engineer - Ward 5'
    },
    seniorOfficer: 'Deepak More (Superintending Engineer)',
    wardAdmin: 'S. G. Chavan (Ward Officer)'
  },
  {
    name: 'Ward 3 - East Zone',
    bounds: { minLat: 16.680, maxLat: 16.720, minLng: 74.245, maxLng: 74.270 },
    department: 'East Commercial Arterial Roads Section',
    primaryEngineer: {
      name: 'Vikas Gaikwad',
      email: 'vikas.gaikwad@roadpulse.demo',
      phone: '+91 98230 99001',
      role: 'Assistant Engineer - Ward 3'
    },
    seniorOfficer: 'Manish Verma (Chief Engineer)',
    wardAdmin: 'V. R. Pawar (Zonal Admin)'
  }
];

// Helper: Calculate Haversine distance in meters
export function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Calculates AI-assisted Risk Score (0 - 100) & Priority Reasons
 */
export function calculateRiskScore(params = {}) {
  const {
    estimatedSize = 'Large',
    trafficRisk = 'HIGH',
    roadType = 'Main Arterial Road',
    sensitiveLocation = 'School & Hospital Zone (<100m)',
    supportCount = 1,
    isReopened = false
  } = params;

  let score = 25; // Base score
  const reasons = [];

  // Size calculation (+10 to +30)
  if (estimatedSize.toLowerCase().includes('large') || estimatedSize.toLowerCase().includes('critical')) {
    score += 30;
    reasons.push('Large Pothole Dimensions (depth > 8cm)');
  } else if (estimatedSize.toLowerCase().includes('medium')) {
    score += 20;
    reasons.push('Medium Pothole Surface Area');
  } else {
    score += 10;
    reasons.push('Minor Road Fissure');
  }

  // Traffic risk (+10 to +20)
  if (trafficRisk === 'HIGH' || trafficRisk === 'CRITICAL') {
    score += 20;
    reasons.push('High Vehicle Density & Bus Route');
  } else if (trafficRisk === 'MEDIUM') {
    score += 15;
    reasons.push('Moderate Commuter Traffic');
  } else {
    score += 10;
  }

  // Road Type (+15)
  if (roadType.includes('Main') || roadType.includes('Highway') || roadType.includes('Arterial')) {
    score += 15;
    reasons.push('Main Traffic Route');
  }

  // Sensitive Location (+15)
  if (sensitiveLocation && sensitiveLocation !== 'None') {
    score += 15;
    reasons.push(`${sensitiveLocation} detected nearby`);
  }

  // Citizen Support (+7 for multi-report threshold)
  if (supportCount > 1) {
    const boost = Math.min(20, Math.floor(supportCount * 2.5));
    score += boost;
    reasons.push(`${supportCount} Citizens Affected & Supported`);
  }

  // Reopened bonus
  if (isReopened) {
    score += 15;
    reasons.push('Prior Repair Failed — Reopened Complaint');
  }

  const finalScore = Math.min(100, Math.max(10, score));

  // Determine Severity
  let severity = 'LOW';
  if (finalScore >= 76) severity = 'CRITICAL';
  else if (finalScore >= 56) severity = 'HIGH';
  else if (finalScore >= 31) severity = 'MEDIUM';

  return {
    riskScore: finalScore,
    severity,
    priorityReasons: reasons,
    isUpgraded: finalScore >= 70
  };
}

/**
 * Ward Identification Engine from Lat/Lng
 */
export function findWardByCoordinates(lat, lng) {
  for (const ward of WARDS_REGISTRY) {
    if (
      lat >= ward.bounds.minLat &&
      lat <= ward.bounds.maxLat &&
      lng >= ward.bounds.minLng &&
      lng <= ward.bounds.maxLng
    ) {
      return ward;
    }
  }
  // Default fallback if outside predefined box
  return WARDS_REGISTRY[0];
}

/**
 * Checks existing reports for nearby duplicates within specified radius
 */
export function detectNearbyDuplicates(lat, lng, existingPotholes = [], radiusMeters = 45) {
  const duplicates = existingPotholes.filter(p => {
    if (p.status === 'Closed' || p.status === 'Resolved') return false;
    const distance = getDistanceInMeters(lat, lng, p.latitude, p.longitude);
    return distance <= radiusMeters;
  });

  return duplicates;
}
