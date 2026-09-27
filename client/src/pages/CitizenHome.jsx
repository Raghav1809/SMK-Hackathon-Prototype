import React, { useState } from 'react';
import NearbyPotholes from '../components/citizen/NearbyPotholes';
import CivicImpactCard from '../components/citizen/CivicImpactCard';
import PotholeMap from '../components/map/PotholeMap';
import { Plus, ShieldAlert, Clock, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export default function CitizenHome({
  user,
  potholes = [],
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onSelectPothole,
  onOpenVerification
}) {
  const activeReports = potholes.filter(p => ['Assigned', 'Acknowledged', 'In Progress', 'Escalated', 'Reopened'].includes(p.status));
  const resolvedReports = potholes.filter(p => p.status === 'Resolved');
  const closedReports = potholes.filter(p => p.status === 'Closed');

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 font-sans border-x border-slate-200/60 shadow-xl">
      
      {/* HOME TAB */}
      {activeTab === 'home' && (
        <div className="p-4 space-y-5 animate-in fade-in duration-300">
          
          {/* Top Greeting Section (#9) */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h2 className="font-extrabold text-xl text-slate-900">Good evening, {user.name.split(' ')[0]} 👋</h2>
              <p className="text-xs text-slate-500 font-medium">Help make your roads safer today.</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 fill-blue-600 text-blue-600" />
            </div>
          </div>

          {/* Visually Dominant Main CTA: 🚧 REPORT POTHOLE (#9) */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500"></div>
            
            <button
              onClick={onOpenReportModal}
              className="relative w-full p-5 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl shadow-2xl border border-white/10 flex items-center justify-between text-left transition-all transform group-hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="space-y-1">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Instant AI GPS Intake
                </span>
                <h3 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
                  🚧 REPORT POTHOLE
                </h3>
                <p className="text-xs text-slate-300">Auto-detect location, risk score & ward routing</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:bg-blue-500 transition-colors">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Quick Active Resolved Alert Prompt if Pending Verification */}
          {resolvedReports.length > 0 && (
            <div
              onClick={() => onOpenVerification(resolvedReports[0])}
              className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl cursor-pointer hover:bg-emerald-100 transition-all flex items-center justify-between animate-pulse"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-xs text-emerald-900">🚧 Repair Pending Verification</h4>
                  <p className="text-[11px] text-emerald-700">Pothole {resolvedReports[0].complaintId} marked resolved. Verify now →</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          {/* Nearby Issues Section (#9) */}
          <NearbyPotholes
            potholes={potholes}
            onSelectPothole={onSelectPothole}
          />

          {/* Your Reports Active Preview */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Your Active Reports ({activeReports.length})
              </h3>
              <button onClick={() => setActiveTab('reports')} className="text-xs font-bold text-blue-600 hover:underline">
                View All →
              </button>
            </div>

            {activeReports.slice(0, 2).map(rep => (
              <div
                key={rep.complaintId}
                onClick={() => onSelectPothole(rep)}
                className="p-3.5 bg-white rounded-2xl shadow-ios border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rep.complaintId}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      rep.status === 'Escalated' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-700 truncate max-w-[220px] mt-0.5">{rep.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rep.ward} • Assigned to {rep.assignedEngineer?.name}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-blue-600 font-mono">24h SLA</span>
                  <span className="text-[10px] text-slate-400 block">Ticking Live</span>
                </div>
              </div>
            ))}
          </div>

          {/* Civic Impact Mini Teaser */}
          <CivicImpactCard user={user} />

        </div>
      )}

      {/* MAP TAB */}
      {activeTab === 'map' && (
        <div className="p-3 h-[calc(100vh-140px)] flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Live City Pothole Map
            </h3>
            <span className="text-xs font-semibold text-slate-500">{potholes.length} Markers</span>
          </div>

          <div className="flex-1 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <PotholeMap
              potholes={potholes}
              onSelectPothole={onSelectPothole}
            />
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="p-4 space-y-4 animate-in fade-in duration-300">
          <div>
            <h2 className="font-extrabold text-lg text-slate-900">Your Reported Issues</h2>
            <p className="text-xs text-slate-500">Track real-time progress and verification states</p>
          </div>

          <div className="space-y-3">
            {potholes.map(p => (
              <div
                key={p.complaintId}
                onClick={() => onSelectPothole(p)}
                className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80 hover:border-blue-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-500">{p.complaintId}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    p.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                    p.status === 'Closed' ? 'bg-slate-100 text-slate-700' :
                    p.status === 'Escalated' ? 'bg-rose-100 text-rose-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img src={p.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{p.title}</h4>
                    <p className="text-[11px] text-slate-500">{p.address}</p>
                    <div className="text-[10px] font-bold text-blue-600 mt-1">Risk Score: {p.riskScore}/100</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE / IMPACT TAB */}
      {activeTab === 'profile' && (
        <div className="p-4 space-y-4 animate-in fade-in duration-300">
          <CivicImpactCard user={user} />
        </div>
      )}

    </div>
  );
}
