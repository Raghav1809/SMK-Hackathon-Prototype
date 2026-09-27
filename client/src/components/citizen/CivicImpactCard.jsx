import React from 'react';
import { Award, ShieldCheck, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function CivicImpactCard({ user }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-white/10 relative overflow-hidden space-y-4">
      
      {/* Subtle Background Glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-900 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20">
            🏅
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-amber-400" />
              Verified Civic Hero
            </div>
            <h3 className="font-extrabold text-base tracking-tight">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.ward}</p>
          </div>
        </div>

        {/* Impact Score Gauge */}
        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">Impact Score</div>
          <div className="text-2xl font-black text-amber-400 font-mono leading-none">{user.impactScore || 420}</div>
        </div>
      </div>

      {/* Badge Tag */}
      <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 flex items-center justify-between text-xs font-semibold relative z-10">
        <span className="text-slate-300">Active Badge:</span>
        <span className="text-amber-300 font-bold flex items-center gap-1">
          🏅 Road Safety Champion
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1 relative z-10">
        <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
          <div className="text-lg font-extrabold text-blue-400">{user.reportsSubmitted || 8}</div>
          <div className="text-[10px] text-slate-400">Reports Filed</div>
        </div>
        <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
          <div className="text-lg font-extrabold text-emerald-400">{user.repairsVerified || 12}</div>
          <div className="text-[10px] text-slate-400">Verifications</div>
        </div>
        <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5">
          <div className="text-lg font-extrabold text-purple-400">6</div>
          <div className="text-[10px] text-slate-400">Repairs Done</div>
        </div>
      </div>

    </div>
  );
}
