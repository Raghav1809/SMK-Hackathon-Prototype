import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { potholesAPI } from '../../services/api';
import { X, Clock, MapPin, User, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, ThumbsUp } from 'lucide-react';

export default function ReportDetailModal({ pothole, isOpen, onClose, onRefresh, onOpenVerification }) {
  const { addToast } = useNotifications();
  const [pData, setPData] = useState(pothole);

  // SLA Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 24, seconds: 6 });

  useEffect(() => {
    setPData(pothole);
  }, [pothole]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !pData) return null;

  const handleSupport = async () => {
    try {
      const res = await potholesAPI.support(pData.complaintId);
      if (res && res.pothole) {
        setPData(res.pothole);
        addToast('Support Added', `Supported ${pData.complaintId}. Risk score updated!`, 'success');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  const isResolved = pData.status === 'Resolved';
  const isClosed = pData.status === 'Closed';
  const isEscalated = pData.status === 'Escalated';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
              pData.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
              pData.severity === 'HIGH' ? 'bg-orange-500 text-white' :
              'bg-amber-500 text-slate-900'
            }`}>
              {pData.severity} RISK
            </span>
            <span className="font-bold text-sm text-slate-300">{pData.complaintId}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-5">
          
          {/* Main Title & Image Header */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-md">
              <img src={pData.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold">
                📍 {pData.address}
              </div>
              <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                Risk Score: {pData.riskScore}/100
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{pData.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{pData.description}</p>
            </div>
          </div>

          {/* SLA Countdown Timer Box (#20) */}
          {!isClosed && !isResolved && (
            <div className={`p-4 rounded-2xl border text-center space-y-2 ${
              isEscalated ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-900 text-white'
            }`}>
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {isEscalated ? 'SLA BREACHED — Escalated to Commissioner' : 'Resolution SLA Countdown'}
              </div>
              
              <div className="font-mono font-black text-2xl tracking-widest flex items-center justify-center gap-2">
                <span className="bg-white/10 px-2.5 py-1 rounded-xl">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-xl">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/10 px-2.5 py-1 rounded-xl text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
              
              <p className="text-[11px] opacity-75">
                {isEscalated ? 'Resolution deadline exceeded. Priority automatically escalated.' : '24-Hour Ward Officer Resolution Guarantee'}
              </p>
            </div>
          )}

          {/* Verification Callout (#26) */}
          {isResolved && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-emerald-900 space-y-3 animate-pulse">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">🚧 Repair Marked Completed!</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    The assigned ward engineer has submitted proof of work. Please verify if the pothole is fixed.
                  </p>
                </div>
              </div>

              <button
                onClick={() => { onClose(); onOpenVerification(pData); }}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                Verify Repair Now →
              </button>
            </div>
          )}

          {/* Before / After Evidence Photos if Available (#25) */}
          {(pData.beforeImage || pData.afterImage) && (
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Proof of Resolution:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">BEFORE</span>
                  <div className="h-24 rounded-xl overflow-hidden bg-slate-100 border">
                    <img src={pData.beforeImage || pData.image} className="w-full h-full object-cover" alt="Before" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600">AFTER REPAIR</span>
                  <div className="h-24 rounded-xl overflow-hidden bg-emerald-50 border border-emerald-200">
                    <img src={pData.afterImage || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"} className="w-full h-full object-cover" alt="After" />
                  </div>
                </div>
              </div>
              {pData.repairNotes && (
                <p className="text-xs italic text-slate-600 bg-slate-50 p-2.5 rounded-xl border">
                  "{pData.repairNotes}"
                </p>
              )}
            </div>
          )}

          {/* Timeline Tracking (#19) */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Complaint Resolution Timeline:</h4>
            
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-200">
              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                <div className="text-xs font-bold text-slate-900">Reported & Verified</div>
                <div className="text-[10px] text-slate-400">Recorded via Citizen App</div>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                <div className="text-xs font-bold text-slate-900">Assigned to {pData.ward}</div>
                <div className="text-[10px] text-slate-400">Engineer: {pData.assignedEngineer?.name || 'Amit Patil'}</div>
              </div>

              <div className="relative">
                <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full ring-4 ring-white ${
                  ['Acknowledged', 'In Progress', 'Resolved', 'Closed'].includes(pData.status) ? 'bg-emerald-500' : 'bg-slate-300'
                }`}></div>
                <div className="text-xs font-bold text-slate-900">Engineer Acknowledged</div>
                <div className="text-[10px] text-slate-400">SLA 4-Hour Response Target</div>
              </div>

              <div className="relative">
                <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full ring-4 ring-white ${
                  ['In Progress', 'Resolved', 'Closed'].includes(pData.status) ? 'bg-emerald-500' : 'bg-slate-300'
                }`}></div>
                <div className="text-xs font-bold text-slate-900">Repair Team On Site</div>
                <div className="text-[10px] text-slate-400">Hot-mix asphalt compaction</div>
              </div>

              <div className="relative">
                <div className={`absolute -left-[21px] top-0 w-3 h-3 rounded-full ring-4 ring-white ${
                  ['Resolved', 'Closed'].includes(pData.status) ? 'bg-emerald-500' : 'bg-slate-300'
                }`}></div>
                <div className="text-xs font-bold text-slate-900">Citizen Verification</div>
                <div className="text-[10px] text-slate-400">Closed-loop citizen audit</div>
              </div>
            </div>
          </div>

          {/* Community Support CTA (#18) */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-600">
              👍 <span className="font-bold text-slate-900">{pData.supportCount || 1} citizens</span> affected
            </div>
            <button
              onClick={handleSupport}
              className="px-4 py-2 bg-blue-50 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1.5"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              I Have the Same Issue (+1)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
