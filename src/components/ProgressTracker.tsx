import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Plus,
  Calendar,
  Sparkles,
  Heart,
  Droplet,
  Zap,
  Scale,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { TrendDataPoint, UserProfile } from '../types';

interface ProgressTrackerProps {
  userProfile: UserProfile;
  trends: TrendDataPoint[];
  onAddTrendPoint: (point: TrendDataPoint) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  userProfile,
  trends,
  onAddTrendPoint,
}) => {
  const [activeMetric, setActiveMetric] = useState<'hba1c' | 'bp' | 'lipids' | 'kidney' | 'weight'>('hba1c');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form state for manual log
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logWeight, setLogWeight] = useState('84.0');
  const [logSysBP, setLogSysBP] = useState('126');
  const [logDiaBP, setLogDiaBP] = useState('80');
  const [logHbA1c, setLogHbA1c] = useState('7.2');
  const [logGlucose, setLogGlucose] = useState('135');
  const [logCholesterol, setLogCholesterol] = useState('228');

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newPoint: TrendDataPoint = {
      date: logDate,
      weight: parseFloat(logWeight) || undefined,
      sysBP: parseInt(logSysBP) || undefined,
      diaBP: parseInt(logDiaBP) || undefined,
      hba1c: parseFloat(logHbA1c) || undefined,
      glucose: parseInt(logGlucose) || undefined,
      cholesterol: parseInt(logCholesterol) || undefined,
    };

    onAddTrendPoint(newPoint);
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Module 12 — Progress Tracking & Health Trends</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Biomarker & Vital Sign Health Trajectory</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor longitudinal changes in blood sugar, lipid profiles, blood pressure, kidney function, and body mass.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
          id="btn-log-vitals-modal"
        >
          <Plus className="w-4 h-4" />
          <span>Log Today's Vitals / Labs</span>
        </button>
      </div>

      {/* Metric Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveMetric('hba1c')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeMetric === 'hba1c'
              ? 'bg-slate-800 border-amber-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span>HbA1c & Glucose</span>
            <Droplet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-300">7.2% HbA1c</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Improving (-0.4%)</div>
        </button>

        <button
          onClick={() => setActiveMetric('bp')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeMetric === 'bp'
              ? 'bg-slate-800 border-sky-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Blood Pressure</span>
            <Heart className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-sky-300">126/80 mmHg</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Stable Trend</div>
        </button>

        <button
          onClick={() => setActiveMetric('lipids')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeMetric === 'lipids'
              ? 'bg-slate-800 border-rose-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Lipid Profile</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-sm font-bold text-rose-300">228 mg/dL Chol</div>
          <div className="text-[10px] text-slate-400 mt-0.5">LDL 142 mg/dL</div>
        </button>

        <button
          onClick={() => setActiveMetric('kidney')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeMetric === 'kidney'
              ? 'bg-slate-800 border-teal-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Kidney (eGFR)</span>
            <Zap className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-sm font-bold text-teal-300">88 eGFR</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Creatinine 1.0</div>
        </button>

        <button
          onClick={() => setActiveMetric('weight')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeMetric === 'weight'
              ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Weight & BMI</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-300">84.0 kg</div>
          <div className="text-[10px] text-slate-400 mt-0.5">BMI 26.5</div>
        </button>
      </div>

      {/* Interactive Chart Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>
              {activeMetric === 'hba1c' && 'HbA1c Glycated Hemoglobin (%) & Fasting Glucose Trajectory'}
              {activeMetric === 'bp' && 'Systolic & Diastolic Blood Pressure (mmHg) Trajectory'}
              {activeMetric === 'lipids' && 'Total Cholesterol & LDL Cholesterol (mg/dL) Trajectory'}
              {activeMetric === 'kidney' && 'Kidney Function: eGFR (mL/min) & Creatinine (mg/dL)'}
              {activeMetric === 'weight' && 'Body Weight (kg) Trend'}
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Target Goal Line Included
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === 'hba1c' ? (
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" domain={[5, 10]} stroke="#f59e0b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[80, 200]} stroke="#38bdf8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line yAxisId="left" type="monotone" dataKey="hba1c" name="HbA1c (%)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
                <Line yAxisId="right" type="monotone" dataKey="glucose" name="Fasting Glucose (mg/dL)" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            ) : activeMetric === 'bp' ? (
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 160]} stroke="#38bdf8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="sysBP" name="Systolic BP (mmHg)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="diaBP" name="Diastolic BP (mmHg)" stroke="#818cf8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            ) : activeMetric === 'lipids' ? (
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[100, 280]} stroke="#fb7185" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="cholesterol" name="Total Cholesterol (mg/dL)" stroke="#fb7185" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="ldl" name="LDL Cholesterol (mg/dL)" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" />
              </LineChart>
            ) : activeMetric === 'kidney' ? (
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 110]} stroke="#2dd4bf" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="egfr" name="eGFR (mL/min)" stroke="#2dd4bf" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            ) : (
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[75, 95]} stroke="#34d399" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="weight" name="Weight (kg)" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manual Vitals Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-white">Log Today's Vitals / Lab Readings</h3>

            <form onSubmit={handleSaveLog} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">HbA1c (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logHbA1c}
                    onChange={(e) => setLogHbA1c(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={logGlucose}
                    onChange={(e) => setLogGlucose(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={logSysBP}
                    onChange={(e) => setLogSysBP(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={logDiaBP}
                    onChange={(e) => setLogDiaBP(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    value={logCholesterol}
                    onChange={(e) => setLogCholesterol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-400 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl shadow-md"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
