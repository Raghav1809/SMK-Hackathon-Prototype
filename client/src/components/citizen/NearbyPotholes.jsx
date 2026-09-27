import React from 'react';
import { ShieldAlert, MapPin, ThumbsUp, ChevronRight } from 'lucide-react';

export default function NearbyPotholes({ potholes = [], onSelectPothole, onSupportPothole }) {
  const nearbyList = potholes.filter(p => p.status !== 'Closed').slice(0, 4);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Nearby Issues (Radius 1km)
        </h3>
        <span className="text-xs font-bold text-slate-400">{nearbyList.length} Active</span>
      </div>

      <div className="space-y-2.5">
        {nearbyList.map(pothole => (
          <div
            key={pothole.complaintId}
            onClick={() => onSelectPothole(pothole)}
            className="p-3.5 bg-white rounded-2xl shadow-ios border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer flex items-center gap-3.5 group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
              <img src={pothole.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
              <div className={`absolute top-1 left-1 w-2.5 h-2.5 rounded-full ${
                pothole.severity === 'CRITICAL' ? 'bg-rose-600 animate-pulse' :
                pothole.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
              }`}></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{pothole.complaintId}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                  pothole.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                  pothole.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {pothole.severity}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">{pothole.title}</h4>
              <p className="text-[11px] text-slate-500 truncate">{pothole.address}</p>

              <div className="flex items-center gap-3 mt-1 text-[10px] font-medium text-slate-500">
                <span className="text-blue-600 font-bold">Risk: {pothole.riskScore}/100</span>
                <span>👍 {pothole.supportCount || 1} citizens</span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
