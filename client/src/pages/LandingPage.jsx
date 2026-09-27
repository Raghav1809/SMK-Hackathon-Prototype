import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, HardHat, Shield, ArrowRight, Zap, MapPin, Sparkles } from 'lucide-react';

export default function LandingPage({ onEnterApp }) {
  const { switchRole } = useAuth();

  const handleSelectRole = (role) => {
    switchRole(role);
    onEnterApp(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Animated Gradient Mesh */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Navbar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-black text-2xl tracking-tight">
              Road<span className="text-blue-500">Pulse</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
              Smart Road Intelligence
            </p>
          </div>
        </div>

        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 fill-blue-400" /> Hackathon Prototype
        </span>
      </header>

      {/* Hero Body */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          Report. Route. Resolve. Verify.
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Smarter Roads.<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
              Accountable Resolution.
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            RoadPulse is an intelligent civic-tech platform for citizen photo + GPS pothole reporting, automatic ward routing, 24-hour SLA tracking, and closed-loop verification.
          </p>
        </div>

        {/* Demo Role Switcher Cards (#47) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto pt-4">
          
          {/* Citizen Card */}
          <button
            onClick={() => handleSelectRole('Citizen')}
            className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-300 group shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition-colors">Continue as Citizen</h3>
              <p className="text-xs text-slate-400 mt-1">
                Report potholes with GPS, track SLAs, and verify repairs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400">
              <span>Raghav Sharma Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Engineer Card */}
          <button
            onClick={() => handleSelectRole('Engineer')}
            className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-amber-500/50 hover:bg-slate-900 transition-all duration-300 group shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors">Continue as Ward Officer</h3>
              <p className="text-xs text-slate-400 mt-1">
                View priority queue, upload before/after proof, manage work orders.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Amit Patil (Ward 12)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => handleSelectRole('Admin')}
            className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl hover:border-emerald-500/50 hover:bg-slate-900 transition-all duration-300 group shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">Command Center</h3>
              <p className="text-xs text-slate-400 mt-1">
                City heatmap, ward performance, SLA escalations & risk analytics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>City Command Center</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-slate-500 text-xs border-t border-slate-900 relative z-10">
        RoadPulse Platform &copy; 2026 — Smart Civic Tech Infrastructure Demo
      </footer>

    </div>
  );
}
