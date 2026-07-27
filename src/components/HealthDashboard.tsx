import React from 'react';
import {
  Activity,
  Heart,
  Droplet,
  ShieldCheck,
  AlertCircle,
  FileText,
  Pill,
  Sparkles,
  ArrowRight,
  Plus,
  Apple,
  MessageSquareText,
  TrendingUp,
  FileCheck,
  Zap,
} from 'lucide-react';
import {
  UserProfile,
  MedicalReport,
  Medication,
  HealthScores,
  HealthTab,
  ReminderItem,
} from '../types';

interface HealthDashboardProps {
  userProfile: UserProfile;
  healthScores: HealthScores;
  reports: MedicalReport[];
  medications: Medication[];
  reminders: ReminderItem[];
  setActiveTab: (tab: HealthTab) => void;
  onSelectReport: (report: MedicalReport) => void;
  onOpenProfile: () => void;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({
  userProfile,
  healthScores,
  reports,
  medications,
  reminders,
  setActiveTab,
  onSelectReport,
  onOpenProfile,
}) => {
  // Collect abnormal tests across all reports
  const abnormalTests = reports.flatMap((r) =>
    r.tests.filter((t) => t.status !== 'Normal')
  );

  const pendingReminders = reminders.filter((r) => !r.completedToday);

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Summary Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold tracking-wide uppercase mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Personal Health Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hello, {userProfile.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Welcome to your personal health hub. Track lab results, manage prescribed medications, explore dietary guidance, and prepare for doctor visits with AI support.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 text-xs">
              <span className="bg-slate-800 border border-slate-700/80 text-slate-300 px-3 py-1 rounded-full">
                Age: <strong className="text-white">{userProfile.age} yrs</strong>
              </span>
              <span className="bg-slate-800 border border-slate-700/80 text-slate-300 px-3 py-1 rounded-full">
                BMI: <strong className="text-white">{userProfile.bmi} kg/m²</strong>
              </span>
              <span className="bg-slate-800 border border-slate-700/80 text-slate-300 px-3 py-1 rounded-full">
                Blood Group: <strong className="text-white">{userProfile.bloodGroup}</strong>
              </span>
              {userProfile.conditions.diabetes && (
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full font-medium">
                  Type 2 Diabetes
                </span>
              )}
              {userProfile.conditions.hypertension && (
                <span className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-3 py-1 rounded-full font-medium">
                  Hypertension
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              id="dash-upload-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Report</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Edit Health Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module 13 — Health Dashboard Scores & Risk Indicators */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200 tracking-wide uppercase flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Educational Health Indicators</span>
          </h2>
          <span className="text-[11px] text-slate-400">Educational indicators — not clinical diagnoses</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Overall Health Score */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Overall Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-emerald-400">{healthScores.overallScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${healthScores.overallScore}%` }} />
            </div>
          </div>

          {/* Diabetes Risk */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Diabetes Risk</span>
              <Droplet className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="text-lg font-bold text-amber-300">{healthScores.diabetesRisk}</span>
              <div className="text-[11px] text-slate-400 mt-1">HbA1c: 7.2% (Target &lt; 7.0%)</div>
            </div>
            <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded w-max mt-2">
              Requires Diet Focus
            </span>
          </div>

          {/* Heart Health */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Heart Health</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-sky-300">{healthScores.heartHealthScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-sky-400/80 bg-sky-500/10 px-2 py-0.5 rounded w-max mt-2">
              BP 126/80 • Total Chol 228
            </span>
          </div>

          {/* Kidney Health */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Kidney Function</span>
              <Zap className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-teal-300">{healthScores.kidneyHealthScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-teal-400/80 bg-teal-500/10 px-2 py-0.5 rounded w-max mt-2">
              eGFR 88 • Creatinine 1.0
            </span>
          </div>

          {/* Liver Health */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Liver Function</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-emerald-300">{healthScores.liverHealthScore}</span>
              <span className="text-xs text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-max mt-2">
              ALT 28 • AST 24 (Normal)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Reports & Abnormal Labs + Quick Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Abnormal Lab Flags & Recent Medical Reports */}
        <div className="lg:col-span-2 space-y-6">
          {/* Abnormal Lab Findings Summary */}
          {abnormalTests.length > 0 && (
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Attention Required: Abnormal Lab Parameters ({abnormalTests.length})</h3>
                    <p className="text-xs text-slate-400">Identified in recent uploaded medical reports</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>View All Reports</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {abnormalTests.map((t) => (
                  <div
                    key={t.id}
                    className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl hover:border-amber-500/40 transition-colors cursor-pointer"
                    onClick={() => setActiveTab('upload')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{t.testName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between text-xs">
                      <span className="text-slate-400">Result: <strong className="text-white">{t.resultValue}</strong></span>
                      <span className="text-slate-500 text-[11px]">Ref: {t.referenceRange}</span>
                    </div>
                    {t.lifestyleFactors && t.lifestyleFactors.length > 0 && (
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 border-t border-slate-800/80 pt-1.5">
                        💡 {t.lifestyleFactors[0]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Uploaded Reports */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Recent Medical Reports ({reports.length})</h3>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center space-x-1"
              >
                <span>Upload New</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => {
                    onSelectReport(report);
                    setActiveTab('upload');
                  }}
                  className="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {report.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.overallFlag === 'Normal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {report.overallFlag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{report.summaryText}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                      <span>Date: {report.testDate}</span>
                      <span>•</span>
                      <span>{report.hospitalName || 'Lab Report'}</span>
                      <span>•</span>
                      <span>{report.tests.length} Parameters</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>View AI Report</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Medications & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Active Prescribed Medications Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Active Medications ({medications.length})</h3>
              </div>
              <button
                onClick={() => setActiveTab('medications')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Check Interactions
              </button>
            </div>

            <div className="space-y-2.5">
              {medications.map((m) => (
                <div key={m.id} className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{m.name}</span>
                    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{m.dose}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{m.frequency} • Reason: {m.reason}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('medications')}
              className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold py-2 rounded-xl transition-colors text-center border border-slate-700"
            >
              Run Drug Interaction Checker
            </button>
          </div>

          {/* Pending Schedule & Reminders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Today's Schedule</h3>
              <button onClick={() => setActiveTab('reminders')} className="text-xs text-emerald-400 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {pendingReminders.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-200">{r.title}</div>
                    <div className="text-[10px] text-slate-400">{r.time} • {r.type}</div>
                  </div>
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Shortcuts */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Quick AI Workflows</span>
            </h3>

            <button
              onClick={() => setActiveTab('chat')}
              className="w-full text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <MessageSquareText className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Ask AI Health Assistant</div>
                  <div className="text-[10px] text-slate-400">Questions on labs, symptoms, or meds</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className="w-full text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <Apple className="w-4 h-4 text-teal-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-teal-300">Personalized Diet Plan</div>
                  <div className="text-[10px] text-slate-400">Tailored to Diabetes & Cholesterol</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className="w-full text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 p-3 rounded-xl transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-sky-300">Generate Doctor Summary</div>
                  <div className="text-[10px] text-slate-400">Prepare 1-page report for visit</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
