import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Shield, User, HardHat, ShieldCheck, Zap, Sliders } from 'lucide-react';

export default function Header({ onOpenNotifications }) {
  const { user, switchRole, demoMode, setDemoMode } = useAuth();
  const { notifications } = useNotifications();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
                Road<span className="text-blue-600">Pulse</span>
              </h1>
              <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block">
              Report. Route. Resolve. Verify.
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              demoMode
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
            title="Toggle Demo Fallbacks"
          >
            <Zap className={`w-3.5 h-3.5 ${demoMode ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span className="hidden md:inline">Demo Mode</span>
            <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`}></span>
          </button>

          {/* Notifications Icon Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 shadow-sm transition-all"
            >
              {user.role === 'Engineer' ? (
                <HardHat className="w-4 h-4 text-amber-400" />
              ) : user.role === 'Admin' ? (
                <Shield className="w-4 h-4 text-emerald-400" />
              ) : (
                <User className="w-4 h-4 text-blue-400" />
              )}
              <span className="truncate max-w-[90px] sm:max-w-none">{user.role} View</span>
              <Sliders className="w-3 h-3 text-slate-400 opacity-80" />
            </button>

            {/* Dropdown Menu for Switching User Roles */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Role Demo</p>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>

                <div className="py-1 space-y-1">
                  <button
                    onClick={() => { switchRole('Citizen'); setShowRoleMenu(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      user.role === 'Citizen' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Citizen Portal</div>
                      <div className="text-[10px] text-slate-400">Raghav Sharma (citizen@roadpulse.demo)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchRole('Engineer'); setShowRoleMenu(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      user.role === 'Engineer' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <HardHat className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Ward Officer / Engineer</div>
                      <div className="text-[10px] text-slate-400">Amit Patil (Ward 12 Engineer)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { switchRole('Admin'); setShowRoleMenu(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      user.role === 'Admin' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div>Admin Command Center</div>
                      <div className="text-[10px] text-slate-400">City-wide Risk Analytics & Escalation</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
