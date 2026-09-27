import React from 'react';
import { Home, Map, Plus, FileText, UserCheck } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenReportModal }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-1 pointer-events-none md:hidden">
      <div className="max-w-md mx-auto bg-slate-900/90 text-white backdrop-blur-2xl rounded-3xl p-1.5 shadow-2xl border border-white/10 flex items-center justify-around pointer-events-auto">
        
        {/* Home Tab */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'home' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Map Tab */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'map' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        {/* Central Floating Action Button (+) */}
        <button
          onClick={onOpenReportModal}
          className="relative -top-5 w-14 h-14 bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-slate-900 hover:scale-105 active:scale-95 transition-all"
          title="Report Pothole"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Reports Tab */}
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'reports' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Reports</span>
        </button>

        {/* Impact Profile Tab */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'profile' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Impact</span>
        </button>

      </div>
    </div>
  );
}
