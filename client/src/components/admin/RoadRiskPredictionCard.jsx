import React, { useState } from 'react';
import { analyticsAPI } from '../../services/api';
import { Sparkles, Brain, AlertTriangle, TrendingUp, ShieldAlert, Check } from 'lucide-react';

export default function RoadRiskPredictionCard() {
  const [selectedRoad, setSelectedRoad] = useState('MG Road');
  const [prediction, setPrediction] = useState({
    roadName: 'MG Road (Central Arterial)',
    predictedRisk: 'CRITICAL HOTSPOT',
    riskScore: 88,
    potholesCount: 14,
    monthlySpike: '+37%',
    trafficDensity: 'HIGH',
    pastRepairs: 4,
    factors: [
      'Sub-base saturation detected via monsoon GIS layer',
      'Heavy Goods Vehicle Fleet Route (450 buses/hr)',
      '4 patch failures recorded in prior 6 months',
      'High citizen reporting velocity (+37% this month)'
    ],
    recommendation: 'Recommend structural hot-mix resurfacing rather than patch filling.'
  });

  const [loading, setLoading] = useState(false);

  const handlePredict = async (road) => {
    setSelectedRoad(road);
    setLoading(true);
    try {
      const res = await analyticsAPI.predictRisk(road);
      setLoading(false);
      if (res && res.prediction) {
        setPrediction(prev => ({
          ...prev,
          roadName: road,
          riskScore: road === 'Station Road' ? 76 : road === 'Market Road' ? 94 : 88
        }));
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-white/10 space-y-4">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              AI-Assisted Road Risk Prediction — Prototype
            </span>
            <h3 className="font-extrabold text-sm text-white">Predictive Infrastructure Risk Analysis</h3>
          </div>
        </div>
      </div>

      {/* Road Switcher Tabs */}
      <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
        {['MG Road', 'Station Road', 'Market Road'].map(road => (
          <button
            key={road}
            onClick={() => handlePredict(road)}
            className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
              selectedRoad === road ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            {road}
          </button>
        ))}
      </div>

      {/* Prediction Output Card */}
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-white">{prediction.roadName}</h4>
            <p className="text-xs text-amber-400 font-semibold">{prediction.predictedRisk}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold">Risk Forecast</span>
            <span className="text-xl font-black text-rose-400 font-mono">{prediction.riskScore} / 100</span>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-rose-400 font-bold block">{prediction.potholesCount}</span>
            <span className="text-[9px] text-slate-400">Active Potholes</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-amber-400 font-bold block">{prediction.monthlySpike}</span>
            <span className="text-[9px] text-slate-400">Monthly Spike</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-blue-400 font-bold block">{prediction.trafficDensity}</span>
            <span className="text-[9px] text-slate-400">Traffic Risk</span>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <span className="text-purple-400 font-bold block">{prediction.pastRepairs}</span>
            <span className="text-[9px] text-slate-400">Past Patching</span>
          </div>
        </div>

        {/* Key Predictive Factors */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Predictive Risk Factors:</span>
          {prediction.factors.map((factor, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
