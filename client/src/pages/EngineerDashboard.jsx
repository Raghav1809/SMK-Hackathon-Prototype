import React, { useState } from 'react';
import PotholeMap from '../components/map/PotholeMap';
import { HardHat, ShieldAlert, CheckCircle2, Clock, Filter, AlertTriangle, Layers, MapPin } from 'lucide-react';

export default function EngineerDashboard({
  user,
  potholes = [],
  onSelectWorkOrder,
  onOpenBeforeAfter
}) {
  const [filter, setFilter] = useState('All');

  // Filtered List
  const filteredPotholes = potholes.filter(p => {
    if (filter === 'Critical') return p.severity === 'CRITICAL';
    if (filter === 'High') return p.severity === 'HIGH';
    if (filter === 'Medium') return p.severity === 'MEDIUM';
    if (filter === 'Escalated') return p.status === 'Escalated' || p.escalationLevel > 0;
    return true;
  });

  const totalCount = 1284;
  const openCount = 238;
  const resolvedCount = 982;
  const escalatedCount = 64;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Ward Engineer Command Portal</span>
          </div>
          <h2 className="text-2xl font-black">{user.name} — {user.ward}</h2>
          <p className="text-xs text-slate-400">Manage priority repair work orders, SLA deadlines & proof uploads.</p>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> 24h SLA Enforcement Active
          </span>
        </div>
      </div>

      {/* Top Statistic KPI Cards (#22) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Ward Reports</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">{totalCount}</div>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80">
          <span className="text-[10px] font-bold text-blue-600 uppercase">Open Active Queue</span>
          <div className="text-2xl font-black text-blue-600 font-mono mt-1">{openCount}</div>
        </div>

        <div className="p-4 bg-white rounded-3xl shadow-ios border border-slate-200/80">
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified Resolved</span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">{resolvedCount}</div>
        </div>

        <div className="p-4 bg-rose-50 rounded-3xl shadow-ios border border-rose-200">
          <span className="text-[10px] font-bold text-rose-700 uppercase">SLA Escalated</span>
          <div className="text-2xl font-black text-rose-600 font-mono mt-1">{escalatedCount}</div>
        </div>
      </div>

      {/* Main Grid: Priority Queue + Live Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Priority Queue Card List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 space-y-4 flex flex-col h-[650px]">
          
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Priority Work Order Queue
            </h3>
            <span className="text-xs font-bold text-slate-400">{filteredPotholes.length} Listed</span>
          </div>

          {/* Filter Chips (#22) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Critical', 'High', 'Medium', 'Escalated'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-xl font-bold transition-all whitespace-nowrap ${
                  filter === f
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Queue Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredPotholes.map(p => (
              <div
                key={p.complaintId}
                onClick={() => onSelectWorkOrder(p)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 hover:shadow-md ${
                  p.status === 'Escalated'
                    ? 'bg-rose-50/70 border-rose-200 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      p.severity === 'CRITICAL' ? 'bg-rose-600 animate-pulse' :
                      p.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                    }`}></span>
                    <span className="font-bold text-xs text-slate-900">{p.complaintId}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                    p.status === 'Escalated' ? 'bg-rose-600 text-white' :
                    p.status === 'In Progress' ? 'bg-amber-500 text-white' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img src={p.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{p.address}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold text-blue-600">
                      <span>Risk: {p.riskScore}/100</span>
                      <span>👍 {p.supportCount || 1} Reports</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500 text-[10px]">SLA 24h Remaining</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenBeforeAfter(p); }}
                    className="text-xs text-emerald-600 hover:underline font-bold"
                  >
                    Upload Proof →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Live Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80 flex flex-col h-[650px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Engineer Live Ward Map (#23)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">{user.ward} Boundaries</span>
          </div>

          <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <PotholeMap
              potholes={potholes}
              onSelectPothole={onSelectWorkOrder}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
