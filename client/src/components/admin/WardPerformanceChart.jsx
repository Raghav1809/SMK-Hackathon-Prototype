import React from 'react';
import { Building2, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function WardPerformanceChart({ wards = [] }) {
  const sampleWards = wards.length > 0 ? wards : [
    { name: "Ward 12 - Central Zone", compliance: 92, count: 12, resolved: 10, officer: "Amit Patil" },
    { name: "Ward 8 - North Zone", compliance: 81, count: 6, resolved: 4, officer: "Rajesh Sharma" },
    { name: "Ward 5 - South Zone", compliance: 72, count: 4, resolved: 2, officer: "Priya Nair" },
    { name: "Ward 3 - East Zone", compliance: 88, count: 3, resolved: 2, officer: "Vikas Gaikwad" }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Ward Performance & SLA Compliance
          </h3>
          <p className="text-xs text-slate-500">Resolution SLA compliance per municipal ward</p>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          City Avg: 88.5%
        </span>
      </div>

      <div className="space-y-3">
        {sampleWards.map((ward, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-900">{ward.name}</span>
                <span className="text-slate-400 block text-[10px]">Officer: {ward.officer}</span>
              </div>
              <div className="text-right">
                <span className={`font-black font-mono ${
                  ward.compliance >= 90 ? 'text-emerald-600' :
                  ward.compliance >= 80 ? 'text-blue-600' :
                  'text-amber-600'
                }`}>
                  {ward.compliance}% SLA
                </span>
                <span className="text-slate-400 block text-[10px]">{ward.resolved}/{ward.count} Resolved</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  ward.compliance >= 90 ? 'bg-emerald-500' :
                  ward.compliance >= 80 ? 'bg-blue-500' :
                  'bg-amber-500'
                }`}
                style={{ width: `${ward.compliance}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
