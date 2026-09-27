import React, { useState } from 'react';
import PotholeMap from '../components/map/PotholeMap';
import WardPerformanceChart from '../components/admin/WardPerformanceChart';
import RoadRiskPredictionCard from '../components/admin/RoadRiskPredictionCard';
import { Shield, Flame, Activity, TrendingUp, AlertTriangle, Layers, Building2, MapPin } from 'lucide-react';

export default function AdminDashboard({
  potholes = [],
  analytics = null,
  onSelectPothole
}) {
  const [showHeatmap, setShowHeatmap] = useState(true);

  const total = analytics?.total || potholes.length;
  const open = analytics?.open || potholes.filter(p => p.status !== 'Closed' && p.status !== 'Resolved').length;
  const resolved = analytics?.resolved || potholes.filter(p => p.status === 'Resolved' || p.status === 'Closed').length;
  const escalated = analytics?.escalated || potholes.filter(p => p.status === 'Escalated' || p.escalationLevel > 0).length;

  const escalatedList = potholes.filter(p => p.status === 'Escalated' || p.escalationLevel > 0 || p.severity === 'CRITICAL');

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Executive Command Header (#27) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ROADPULSE COMMAND CENTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">City Road Risk & Resolution Intelligence</h2>
          <p className="text-xs text-slate-400">Real-time municipal SLA compliance, automated escalations & predictive hotspot analytics.</p>
        </div>

        {/* Heatmap Toggle Button (#29) */}
        <div className="relative z-10">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold shadow-lg transition-all ${
              showHeatmap
                ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-rose-600/30'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Flame className={`w-4 h-4 ${showHeatmap ? 'fill-white' : ''}`} />
            <span>{showHeatmap ? 'Heatmap Overlay ACTIVE' : 'Enable Risk Heatmap'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid (#27) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Reports</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{total}</div>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80">
          <span className="text-[10px] font-bold text-blue-600 uppercase">Open Active</span>
          <div className="text-2xl font-black text-blue-600 font-mono mt-1">{open}</div>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80">
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Total Resolved</span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{resolved}</div>
        </div>

        <div className="p-4 bg-rose-50 rounded-3xl shadow-ios border border-rose-200">
          <span className="text-[10px] font-bold text-rose-700 uppercase">SLA Escalations</span>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">{escalated}</div>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80 col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-purple-600 uppercase">Avg Resolution</span>
          <div className="text-2xl font-black text-purple-600 font-mono mt-1">4.2 Hrs</div>
        </div>
      </div>

      {/* Main Grid: Command Map + Priority Escalation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large Command Map (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              City-Wide Interactive Command Map (#27, #29)
            </h3>
            {showHeatmap && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-rose-600" /> Hotspot Heatmap Visible
              </span>
            )}
          </div>

          <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <PotholeMap
              potholes={potholes}
              onSelectPothole={onSelectPothole}
              showHeatmap={showHeatmap}
            />
          </div>
        </div>

        {/* Priority Escalation Queue (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 space-y-3 flex flex-col h-[600px]">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Priority Escalation Queue (#21)
            </h3>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {escalatedList.length} Alerts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {escalatedList.map(p => (
              <div
                key={p.complaintId}
                onClick={() => onSelectPothole(p)}
                className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 hover:border-rose-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-900">{p.complaintId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-600 text-white uppercase animate-pulse">
                    ESCALATED
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{p.ward}</p>
                    <p className="text-[10px] text-rose-700 font-bold mt-0.5">
                      Risk: {p.riskScore}/100 • 24h SLA Exceeded
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Ward Performance + Road Risk Intelligence (#28, #30) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WardPerformanceChart wards={analytics?.wardPerformance} />
        <RoadRiskPredictionCard />
      </div>

    </div>
  );
}
