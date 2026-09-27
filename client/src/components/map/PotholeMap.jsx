import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { ShieldAlert, AlertTriangle, CheckCircle2, UserCheck, Flame } from 'lucide-react';

// Custom Animated DivIcon generator for Leaflet Pins
const createPotholeIcon = (severity, status, isSelected) => {
  let colorClass = 'bg-emerald-500 border-white text-white shadow-emerald-500/50';
  let pulseEffect = '';

  if (severity === 'CRITICAL' || status === 'Escalated') {
    colorClass = 'bg-rose-600 border-white text-white shadow-rose-600/50';
    pulseEffect = 'marker-pulse-critical';
  } else if (severity === 'HIGH' || status === 'Reopened') {
    colorClass = 'bg-orange-500 border-white text-white shadow-orange-500/50';
  } else if (severity === 'MEDIUM') {
    colorClass = 'bg-amber-500 border-white text-white shadow-amber-500/50';
  }

  if (status === 'Closed' || status === 'Resolved') {
    colorClass = 'bg-emerald-600 border-white text-white shadow-emerald-600/30';
    pulseEffect = '';
  }

  const iconHtml = `
    <div className="relative flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-xs ${colorClass} ${pulseEffect} transform transition-transform ${isSelected ? 'scale-125 ring-4 ring-blue-500/40' : 'hover:scale-110'}">
        ${status === 'Closed' ? '✓' : severity === 'CRITICAL' ? '!' : '•'}
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to handle map view bounds auto-centering
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

export default function PotholeMap({ potholes = [], onSelectPothole, selectedId, centerLocation, showHeatmap = false }) {
  const defaultCenter = centerLocation || [16.6982, 74.2315];
  const [activePothole, setActivePothole] = useState(null);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200/80">
      
      {/* Legend / Overlay Header */}
      <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-lg border border-white/60 text-xs font-semibold flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          <span className="text-slate-700">Critical ({potholes.filter(p=>p.severity==='CRITICAL').length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          <span className="text-slate-700">High ({potholes.filter(p=>p.severity==='HIGH').length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-700">Med ({potholes.filter(p=>p.severity==='MEDIUM').length})</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRecenter center={defaultCenter} />
        
        {/* OpenStreetMap CartoDB Light Tile Layer for modern clean map styling */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Heatmap Overlay Circles if Heatmap mode enabled */}
        {showHeatmap && potholes.map(p => (
          <Circle
            key={`heat-${p.complaintId}`}
            center={[p.latitude, p.longitude]}
            radius={p.riskScore * 3}
            pathOptions={{
              color: p.riskScore > 75 ? '#ef4444' : p.riskScore > 50 ? '#f97316' : '#f59e0b',
              fillColor: p.riskScore > 75 ? '#ef4444' : p.riskScore > 50 ? '#f97316' : '#f59e0b',
              fillOpacity: 0.35,
              weight: 1
            }}
          />
        ))}

        {/* User GPS Location Marker */}
        {centerLocation && (
          <Marker
            position={centerLocation}
            icon={L.divIcon({
              html: `
                <div className="relative">
                  <div className="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
                  <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          />
        )}

        {/* Pothole Markers */}
        {potholes.map(pothole => (
          <Marker
            key={pothole.complaintId}
            position={[pothole.latitude, pothole.longitude]}
            icon={createPotholeIcon(pothole.severity, pothole.status, selectedId === pothole.complaintId)}
            eventHandlers={{
              click: () => {
                setActivePothole(pothole);
                if (onSelectPothole) onSelectPothole(pothole);
              }
            }}
          />
        ))}
      </MapContainer>

      {/* Floating Bottom Sheet Card for Selected Marker */}
      {activePothole && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-2xl p-4 rounded-3xl shadow-2xl border border-slate-200/80 animate-in slide-in-from-bottom duration-300 max-w-lg mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  activePothole.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                  activePothole.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {activePothole.severity} RISK
                </span>
                <span className="text-xs font-bold text-slate-500">{activePothole.complaintId}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mt-1">{activePothole.title}</h4>
              <p className="text-xs text-slate-500">{activePothole.address}</p>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 inline-block">
                Risk: {activePothole.riskScore}/100
              </div>
              <p className="text-[10px] text-slate-400 mt-1">👍 {activePothole.supportCount} Citizens Affected</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-medium text-slate-600">
              Ward: <span className="font-semibold text-slate-900">{activePothole.ward}</span>
            </div>
            <button
              onClick={() => {
                if (onSelectPothole) onSelectPothole(activePothole);
              }}
              className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md transition-all"
            >
              View Full Details →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
