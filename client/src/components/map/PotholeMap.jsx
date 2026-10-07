import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { ShieldAlert, AlertTriangle, CheckCircle2, UserCheck, Flame } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Custom Icon generator for Google Maps Pins
const getMarkerIcon = (severity, status, isSelected) => {
  let fillColor = '#10b981'; // emerald-500
  let scale = isSelected ? 1.5 : 1;
  let strokeColor = '#ffffff';
  let strokeWeight = isSelected ? 3 : 2;

  if (severity === 'CRITICAL' || status === 'Escalated') {
    fillColor = '#e11d48'; // rose-600
  } else if (severity === 'HIGH' || status === 'Reopened') {
    fillColor = '#f97316'; // orange-500
  } else if (severity === 'MEDIUM') {
    fillColor = '#f59e0b'; // amber-500
  }

  if (status === 'Closed' || status === 'Resolved') {
    fillColor = '#059669'; // emerald-600
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWeight}" />
      ${status === 'Closed' ? '<path d="M10 16l4 4 8-8" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' : 
        severity === 'CRITICAL' ? '<text x="16" y="21" font-family="sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">!</text>' : 
        '<circle cx="16" cy="16" r="4" fill="white" />'}
    </svg>
  `;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(32 * scale, 32 * scale),
    anchor: new window.google.maps.Point(16 * scale, 16 * scale),
  };
};

export default function PotholeMap({ potholes = [], onSelectPothole, selectedId, centerLocation, showHeatmap = false }) {
  const mapCenter = centerLocation ? { lat: centerLocation[0], lng: centerLocation[1] } : { lat: 16.8544, lng: 74.5642 };
  const [activePothole, setActivePothole] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const mapRef = useRef(null);

  const onLoad = useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(function callback(map) {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (mapRef.current && centerLocation) {
      mapRef.current.panTo({ lat: centerLocation[0], lng: centerLocation[1] });
    }
  }, [centerLocation]);

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

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [ { featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] } ]
          }}
        >
          {/* Heatmap Overlay Circles if Heatmap mode enabled */}
          {showHeatmap && potholes.map(p => (
            <Circle
              key={`heat-${p.complaintId}`}
              center={{ lat: p.latitude, lng: p.longitude }}
              radius={p.riskScore * 10}
              options={{
                fillColor: p.riskScore > 75 ? '#ef4444' : p.riskScore > 50 ? '#f97316' : '#f59e0b',
                fillOpacity: 0.35,
                strokeColor: p.riskScore > 75 ? '#ef4444' : p.riskScore > 50 ? '#f97316' : '#f59e0b',
                strokeOpacity: 0.8,
                strokeWeight: 1,
              }}
            />
          ))}

          {/* User GPS Location Marker */}
          {centerLocation && (
            <Marker
              position={{ lat: centerLocation[0], lng: centerLocation[1] }}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <circle cx="12" cy="12" r="10" fill="#2563eb" stroke="white" stroke-width="2" />
                    <circle cx="12" cy="12" r="4" fill="white" />
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 12),
              }}
            />
          )}

          {/* Pothole Markers */}
          {potholes.map(pothole => (
            <Marker
              key={pothole.complaintId}
              position={{ lat: pothole.latitude, lng: pothole.longitude }}
              icon={getMarkerIcon(pothole.severity, pothole.status, selectedId === pothole.complaintId)}
              onClick={() => {
                setActivePothole(pothole);
                if (onSelectPothole) onSelectPothole(pothole);
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-semibold text-slate-600">
            {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Loading Maps...' : 'API Key Required'}
          </p>
        </div>
      )}

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
