import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useNotifications } from '../../context/NotificationContext';
import { potholesAPI } from '../../services/api';
import { CheckCircle2, AlertTriangle, X, ShieldCheck, ThumbsUp, RotateCcw } from 'lucide-react';

export default function VerificationModal({ pothole, isOpen, onClose, onVerificationSuccess }) {
  const { addToast } = useNotifications();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !pothole) return null;

  const handleVerify = async (result) => {
    setLoading(true);
    try {
      const res = await potholesAPI.verify(pothole.complaintId, result, comment);
      setLoading(false);
      
      if (result === 'VERIFIED') {
        addToast('Verification Confirmed!', 'Thank you for making roads safer! +50 Civic Impact Points.', 'success');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        addToast('Complaint Reopened!', 'High priority alert sent back to Ward Officer.', 'warning');
      }

      if (onVerificationSuccess) onVerificationSuccess(res.pothole);
      onClose();
    } catch (err) {
      setLoading(false);
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Citizen Closed-Loop Verification</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Proof of Work Submitted
            </span>
            <h4 className="font-extrabold text-slate-900 text-base mt-1">🚧 Repair Completed</h4>
            <p className="text-xs text-slate-500">Complaint ID: <span className="font-bold text-slate-900">{pothole.complaintId}</span> — {pothole.address}</p>
          </div>

          {/* Proof Photos Side by Side */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-2xl border">
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 text-center">BEFORE</span>
              <img src={pothole.beforeImage || pothole.image} className="h-28 w-full object-cover rounded-xl" alt="Before" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-600 block mb-1 text-center">REPAIRED PROOF</span>
              <img src={pothole.afterImage || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"} className="h-28 w-full object-cover rounded-xl border-2 border-emerald-500" alt="After" />
            </div>
          </div>

          {/* Feedback Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Optional Citizen Audit Feedback:</label>
            <input
              type="text"
              placeholder="e.g. Surface is smooth and compaction is complete."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Verification Choice Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              disabled={loading}
              onClick={() => handleVerify('VERIFIED')}
              className="flex-1 py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              ✅ Yes, Resolved
            </button>

            <button
              disabled={loading}
              onClick={() => handleVerify('REOPENED')}
              className="flex-1 py-3 bg-rose-50 border-2 border-rose-300 text-rose-800 font-bold text-xs rounded-2xl hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              ❌ Still Exists (Reopen)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
