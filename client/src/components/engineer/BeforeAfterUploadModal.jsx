import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { potholesAPI } from '../../services/api';
import { SAMPLE_POTHOLE_IMAGES } from '../../data/sampleData';
import { Upload, CheckCircle2, X, Image as ImageIcon } from 'lucide-react';

export default function BeforeAfterUploadModal({ pothole, isOpen, onClose, onResolveSuccess }) {
  const { addToast } = useNotifications();

  const [beforeImage, setBeforeImage] = useState(pothole?.image || SAMPLE_POTHOLE_IMAGES.beforeRepair);
  const [afterImage, setAfterImage] = useState(SAMPLE_POTHOLE_IMAGES.afterRepair);
  const [repairNotes, setRepairNotes] = useState('Hot-mix asphalt patch filled, compacted with 3-ton roller, and sealed with emulsion layer.');
  const [repairType, setRepairType] = useState('Hot-Mix Asphalt Patching');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !pothole) return null;

  const handleCustomAfterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAfterImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitResolution = async () => {
    setLoading(true);
    try {
      const updates = {
        status: 'Resolved',
        beforeImage,
        afterImage,
        repairNotes,
        repairType
      };

      const res = await potholesAPI.update(pothole.complaintId, updates);
      setLoading(false);
      addToast('Complaint Resolved!', `Proof uploaded for ${pothole.complaintId}. Citizen verification request sent.`, 'success');
      if (onResolveSuccess) onResolveSuccess(res.pothole);
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
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">Upload Proof of Resolution</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <h4 className="font-bold text-slate-900 text-sm">Work Order: {pothole.complaintId}</h4>
            <p className="text-xs text-slate-500">{pothole.address} ({pothole.ward})</p>
          </div>

          {/* Side by Side Upload Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-500">BEFORE PHOTO</label>
              <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border">
                <img src={beforeImage} className="w-full h-full object-cover" alt="Before" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-emerald-600">AFTER REPAIR PHOTO</label>
              <div className="relative h-28 rounded-xl overflow-hidden bg-emerald-50 border-2 border-emerald-400">
                <img src={afterImage} className="w-full h-full object-cover" alt="After" />
                <label className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-md cursor-pointer hover:bg-slate-900">
                  Change
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomAfterUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Repair Method Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Repair Method / Material:</label>
            <select
              value={repairType}
              onChange={e => setRepairType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Hot-Mix Asphalt Patching">Hot-Mix Asphalt Patching & Compaction</option>
              <option value="Cold Bitumen Fill">Cold Bitumen Rapid Patch</option>
              <option value="Full Sub-base Excavation & Resurfacing">Full Sub-base Excavation & Resurfacing</option>
            </select>
          </div>

          {/* Repair Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Engineer Completion Notes:</label>
            <textarea
              rows={2}
              value={repairNotes}
              onChange={e => setRepairNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            disabled={loading}
            onClick={handleSubmitResolution}
            className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all"
          >
            Mark Complaint RESOLVED & Notify Citizen →
          </button>
        </div>

      </div>
    </div>
  );
}
