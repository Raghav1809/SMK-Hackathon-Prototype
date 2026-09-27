import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { potholesAPI } from '../../services/api';
import { CAMERA_SAMPLE_PHOTOS } from '../../data/sampleData';
import {
  Camera, Upload, MapPin, Sparkles, AlertTriangle, CheckCircle2,
  ArrowRight, ArrowLeft, X, Layers, Users, Clock, ShieldCheck, Zap
} from 'lucide-react';

export default function ReportingModal({ isOpen, onClose, onReportSuccess }) {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [step, setStep] = useState(1); // 1: Image, 2: Location, 3: Duplicates Check, 4: AI Analysis, 5: Confirmation
  const [selectedImage, setSelectedImage] = useState(CAMERA_SAMPLE_PHOTOS[0].url);
  const [customPhotoName, setCustomPhotoName] = useState('Captured Photo');

  // Location State
  const [lat, setLat] = useState(16.6982);
  const [lng, setLng] = useState(74.2315);
  const [address, setAddress] = useState('MG Road, near St. Xavier High School');
  const [locationLoading, setLocationLoading] = useState(false);

  // Duplicates State
  const [nearbyDuplicates, setNearbyDuplicates] = useState([]);
  const [isDuplicateDetected, setIsDuplicateDetected] = useState(false);

  // AI Assessment State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisText, setAnalysisText] = useState('Analyzing road surface...');

  const [assessmentResult, setAssessmentResult] = useState({
    potholeDetected: true,
    severity: 'CRITICAL',
    estimatedSize: 'Large (approx. 1.4m x 1.1m, depth 12cm)',
    trafficRisk: 'HIGH',
    roadType: 'Main Arterial Road',
    sensitiveLocation: 'School Zone (<50m)',
    riskScore: 87,
    priorityReasons: [
      'Large Deep Crater (>10cm depth)',
      'Main Arterial Traffic Route',
      'School & Hospital Zone nearby (<100m)',
      'High Peak-Hour Commuter Density'
    ]
  });

  const [createdReport, setCreatedReport] = useState(null);

  // Geolocation trigger on Step 2
  useEffect(() => {
    if (step === 2) {
      if (navigator.geolocation) {
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLat(Number(pos.coords.latitude.toFixed(4)));
            setLng(Number(pos.coords.longitude.toFixed(4)));
            setAddress(`Detected GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (MG Road)` );
            setLocationLoading(false);
          },
          (err) => {
            console.warn('GPS denied or unavailable, using demo location');
            setLocationLoading(false);
          },
          { timeout: 4000 }
        );
      }
    }
  }, [step]);

  if (!isOpen) return null;

  // Handle Image Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setCustomPhotoName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2 -> Check Duplicates
  const handleProceedToDuplicates = async () => {
    setStep(3);
    const res = await potholesAPI.checkDuplicates(lat, lng);
    if (res && res.hasDuplicates) {
      setNearbyDuplicates(res.duplicates);
      setIsDuplicateDetected(true);
    } else {
      setIsDuplicateDetected(false);
      startAIAnalysis();
    }
  };

  // Step 3 -> Run Simulated AI Analysis Animation
  const startAIAnalysis = () => {
    setStep(4);
    setAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisText('Analyzing road condition...');

    setTimeout(() => {
      setAnalysisProgress(45);
      setAnalysisText('Detecting pothole dimensions & surface depth...');
    }, 700);

    setTimeout(() => {
      setAnalysisProgress(75);
      setAnalysisText('Cross-referencing School & Hospital GIS layers...');
    }, 1400);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisText('Calculating Risk Score & Ward Routing...');
      setAnalyzing(false);
    }, 2200);
  };

  // Final Submit Report
  const handleSubmitReport = async () => {
    try {
      const payload = {
        title: `Pothole Report near ${address}`,
        description: `Citizen photo report submitted via iOS mobile app.`,
        image: selectedImage,
        latitude: lat,
        longitude: lng,
        address: address,
        estimatedSize: assessmentResult.estimatedSize,
        trafficRisk: assessmentResult.trafficRisk,
        roadType: assessmentResult.roadType,
        sensitiveLocation: assessmentResult.sensitiveLocation,
        reportedBy: {
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 98765 43210'
        }
      };

      const res = await potholesAPI.create(payload);
      if (res && res.pothole) {
        setCreatedReport(res.pothole);
        setStep(5);
        addToast('Report Created', `Assigned to ${res.pothole.ward}`, 'success');
        if (onReportSuccess) onReportSuccess(res.pothole);

        // Confetti burst!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      addToast('Submission Error', err.message, 'error');
    }
  };

  // Support Existing Duplicate Report
  const handleSupportExisting = async (dupId) => {
    try {
      const res = await potholesAPI.support(dupId, user.email);
      addToast('Support Added', `Supported report ${dupId}. Priority upgraded!`, 'success');
      onClose();
    } catch (err) {
      addToast('Error', err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              🚧
            </div>
            <div>
              <h3 className="font-bold text-sm">Report Pothole</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 5 — Smart Intelligent Intake</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Steps */}
        <div className="p-5">

          {/* STEP 1: CAPTURE PHOTO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-bold text-slate-900 text-base">Step 1 — Capture Photo</h4>
                <p className="text-xs text-slate-500 mt-0.5">Capture or select clear photo of road damage</p>
              </div>

              {/* Viewfinder Preview Container */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center shadow-inner">
                {selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold">No Image Selected</p>
                  </div>
                )}
                
                {/* Viewfinder Overlays */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                  📷 {customPhotoName}
                </div>
              </div>

              {/* Sample Preset Photo Switcher for Hackathon Demo */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demo Preset Photos:</p>
                <div className="grid grid-cols-3 gap-2">
                  {CAMERA_SAMPLE_PHOTOS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedImage(sample.url); setCustomPhotoName(sample.name); }}
                      className={`p-1.5 rounded-xl border text-left text-[11px] font-medium transition-all ${
                        selectedImage === sample.url ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="h-10 rounded-lg overflow-hidden mb-1">
                        <img src={sample.url} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="truncate">{sample.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Upload Actions */}
              <div className="flex gap-2 pt-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-200 cursor-pointer transition-all">
                  <Upload className="w-4 h-4" />
                  Upload Gallery
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>

                <button
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                >
                  Next: Location →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & GPS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-bold text-slate-900 text-base">Step 2 — Location Detection</h4>
                <p className="text-xs text-slate-500 mt-0.5">Automatically fetching GPS coordinates & address</p>
              </div>

              {/* Location Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Current GPS Location</span>
                    <h5 className="font-bold text-xs text-slate-900">{address}</h5>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Lat: {lat} | Lng: {lng}
                    </p>
                  </div>
                </div>

                {/* Editable Street Name Address */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Adjust Street / Landmark Address:</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleProceedToDuplicates}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                >
                  Next: Smart Analysis →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DUPLICATE DETECTION CHECK */}
          {step === 3 && (
            <div className="space-y-4">
              {isDuplicateDetected ? (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-900">⚠️ Similar Issue Nearby Detected!</h4>
                      <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                        A pothole report <span className="font-bold">({nearbyDuplicates[0]?.complaintId})</span> was already filed within <span className="font-bold">35 meters</span> of your location by <span className="font-bold">{nearbyDuplicates[0]?.supportCount || 14} citizens</span>.
                      </p>
                    </div>
                  </div>

                  {/* Duplicate Card */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{nearbyDuplicates[0]?.title}</div>
                    <div className="text-slate-500">{nearbyDuplicates[0]?.address}</div>
                    <div className="text-blue-600 font-semibold">Priority: {nearbyDuplicates[0]?.severity} ({nearbyDuplicates[0]?.riskScore}/100)</div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleSupportExisting(nearbyDuplicates[0]?.complaintId)}
                      className="flex-1 py-2.5 bg-amber-600 text-white font-bold text-xs rounded-xl hover:bg-amber-700 shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      👍 Support Existing Report (+1)
                    </button>
                    <button
                      onClick={startAIAnalysis}
                      className="px-4 py-2.5 bg-white border border-amber-300 text-amber-900 font-semibold text-xs rounded-xl hover:bg-amber-100 transition-all"
                    >
                      Report Different Pothole
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto animate-spin">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Checking Nearby Duplicate Reports...</h4>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: AI-ASSISTED ASSESSMENT */}
          {step === 4 && (
            <div className="space-y-4">
              {analyzing ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 animate-pulse">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{analysisText}</h4>
                    <p className="text-xs text-slate-500 mt-1">Cross-referencing location, road type, and GIS layers</p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 fill-blue-600" />
                        AI-Assisted Assessment — Prototype
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base mt-0.5">Pothole Detected ✓</h4>
                    </div>
                    {/* Risk Score Pill */}
                    <div className="text-right bg-gradient-to-br from-rose-500 to-rose-600 text-white px-3 py-1.5 rounded-2xl shadow-md">
                      <div className="text-[10px] font-bold uppercase opacity-90">Risk Score</div>
                      <div className="text-lg font-black leading-none">{assessmentResult.riskScore} <span className="text-xs font-medium">/ 100</span></div>
                    </div>
                  </div>

                  {/* Assessment Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Severity</span>
                      <span className="font-bold text-rose-600">{assessmentResult.severity}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Est. Dimensions</span>
                      <span className="font-bold text-slate-900">{assessmentResult.estimatedSize}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Traffic Risk</span>
                      <span className="font-bold text-slate-900">{assessmentResult.trafficRisk}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Sensitive Location</span>
                      <span className="font-bold text-blue-700">{assessmentResult.sensitiveLocation}</span>
                    </div>
                  </div>

                  {/* Explainable Priority Reasons */}
                  <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2">
                    <h5 className="font-bold text-xs text-blue-900">Why is this HIGH Priority?</h5>
                    <div className="space-y-1 text-xs text-blue-800">
                      {assessmentResult.priorityReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] font-bold text-blue-700 pt-1">
                      ⚡ Priority automatically upgraded to HIGH.
                    </div>
                  </div>

                  {/* Automatic Ward Routing Box */}
                  <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-1 text-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Automatic Ward Routing Engine</div>
                    <div className="flex justify-between font-medium">
                      <span>Assigned Ward:</span>
                      <span className="font-bold text-amber-400">Ward 12 — Central Zone</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Assigned Engineer:</span>
                      <span className="font-bold text-white">Amit Patil</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Resolution SLA:</span>
                      <span className="font-bold text-emerald-400">24 Hours</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitReport}
                    className="w-full py-3 bg-blue-600 text-white font-bold text-sm rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    Confirm & Submit Report 🚀
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION SCREEN */}
          {step === 5 && createdReport && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">✓ Report Successfully Submitted</h4>
                <p className="text-xs text-slate-500">Complaint ID: <span className="font-bold text-slate-900">{createdReport.complaintId}</span></p>
              </div>

              {/* Confirmation Details Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Automatically Routed To:</span>
                  <span className="font-bold text-slate-900">{createdReport.ward}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Assigned Engineer:</span>
                  <span className="font-bold text-slate-900">{createdReport.assignedEngineer?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Calculated Risk Score:</span>
                  <span className="font-bold text-rose-600">{createdReport.riskScore} / 100</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Expected Acknowledgement:</span>
                  <span className="font-bold text-blue-600">Within 4 Hours</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 shadow-lg transition-all"
                >
                  Track Report in Dashboard
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
