import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { potholesAPI } from '../../services/api';
import { X, Clock, AlertTriangle, ShieldAlert, CheckCircle2, Play, Upload, ArrowUpRight, Zap } from 'lucide-react';

export default function EngineerWorkOrderModal({ pothole, isOpen, onClose, onRefresh, onOpenBeforeAfter }) {
  const { addToast } = useNotifications();
  const [pData, setPData] = useState(pothole);
  const [loading, setLoading] = useState(false);

  // SLA Live Ticking Timer
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

  // Handle Action Status Updates
  const handleUpdateStatus = async (newStatus) => {
    setLoading(true);
    try {
      const res = await potholesAPI.update(pData.complaintId, { status: newStatus });
      setLoading(false);
      if (res && res.pothole) {
        setPData(res.pothole);
        addToast('Status Updated', `Work order ${pData.complaintId} status set to ${newStatus}.`, 'success');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setLoading(false);
      addToast('Error', err.message, 'error');
    }
  };

  // Trigger Instant SLA Breach Escalation Demo (#21)
  const handleTriggerSlaBreach = async () => {
    setLoading(true);
    try {
      const res = await potholesAPI.escalate(pData.complaintId, 'Resolution deadline exceeded. Priority automatically escalated by Admin/System.');
      setLoading(false);
      if (res && res.pothole) {
        setPData(res.pothole);
        addToast('🚨 SLA BREACH TRIGGERED', `Complaint ${pData.complaintId} escalated to Senior Engineer & Ward Commissioner!`, 'escalation');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setLoading(false);
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
              pData.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-orange-500 text-white'
            }`}>
              {pData.severity}
            </span>
            <h3 className="font-extrabold text-sm">Work Order #{pData.complaintId}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          
          {/* Main Info Card */}
          <div className="flex items-start gap-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border">
              <img src={pData.image} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm">{pData.title}</h4>
              <p className="text-xs text-slate-500">📍 {pData.address}</p>
              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                  Risk: {pData.riskScore}/100
                </span>
                <span className="text-slate-500 font-medium">👍 {pData.supportCount || 14} Reports</span>
              </div>
            </div>
          </div>

          {/* SLA Countdown Timer Box */}
          <div className={`p-3.5 rounded-2xl border text-center space-y-1 ${
            pData.status === 'Escalated' ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-slate-900 text-white'
          }`}>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pData.status === 'Escalated' ? '⚠️ SLA BREACHED — ESCALATED TO COMMISSIONER' : 'RESOLUTION SLA COUNTDOWN'}
            </div>
            <div className="font-mono font-black text-xl tracking-widest text-amber-400">
              {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Escalation History Alert Box (#21) */}
          {pData.escalationHistory && pData.escalationHistory.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-2">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Automatic Escalation Chain Triggered:
              </div>
              {pData.escalationHistory.map((esc, idx) => (
                <div key={idx} className="bg-white p-2 rounded-xl border border-rose-200 text-rose-900 space-y-0.5">
                  <div className="font-bold text-[11px]">Level {esc.level}: Escalated to {esc.escalatedTo}</div>
                  <div className="text-[10px] text-slate-500">Reason: {esc.reason}</div>
                </div>
              ))}
            </div>
          )}

          {/* Details Table Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Assigned Ward</span>
              <span className="font-bold text-slate-900">{pData.ward}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Department</span>
              <span className="font-bold text-slate-900">{pData.department}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Traffic Density</span>
              <span className="font-bold text-slate-900">{pData.trafficRisk}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border">
              <span className="text-slate-400 block text-[10px]">Current Status</span>
              <span className="font-bold text-blue-600">{pData.status}</span>
            </div>
          </div>

          {/* Engineer Work Order Action Buttons */}
          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {pData.status === 'Assigned' && (
                <button
                  disabled={loading}
                  onClick={() => handleUpdateStatus('Acknowledged')}
                  className="py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md transition-all"
                >
                  ✓ Acknowledge Work Order
                </button>
              )}

              {['Assigned', 'Acknowledged'].includes(pData.status) && (
                <button
                  disabled={loading}
                  onClick={() => handleUpdateStatus('In Progress')}
                  className="py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 shadow-md transition-all flex items-center justify-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Start Repair Work
                </button>
              )}
            </div>

            <button
              onClick={() => { onClose(); onOpenBeforeAfter(pData); }}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              Upload Before/After Proof & Mark RESOLVED →
            </button>

            {/* Instant SLA Breach Demo Trigger Button for Hackathon Judges */}
            <div className="pt-2 border-t border-slate-100">
              <button
                disabled={loading}
                onClick={handleTriggerSlaBreach}
                className="w-full py-2 bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
                title="Simulate SLA Timeout for Judge Demo"
              >
                <Zap className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                ⚡ Demo Trigger: Simulate SLA Breach & Auto-Escalate
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
