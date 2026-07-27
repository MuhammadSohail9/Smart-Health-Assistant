import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Printer,
  Copy,
  Sparkles,
  Loader2,
  CheckCircle2,
  Stethoscope,
  Calendar,
  AlertCircle,
  Pill,
  Apple,
} from 'lucide-react';
import {
  UserProfile,
  MedicalReport,
  Medication,
  HealthSummary,
} from '../types';

interface HealthSummaryViewProps {
  userProfile: UserProfile;
  reports: MedicalReport[];
  medications: Medication[];
}

export const HealthSummaryView: React.FC<HealthSummaryViewProps> = ({
  userProfile,
  reports,
  medications,
}) => {
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/health-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          reports,
          medications,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateSummary();
  }, [userProfile.id]);

  const handleCopyText = () => {
    if (!summary) return;
    const textToCopy = `AI HEALTH ASSISTANT — CLINICAL CONVERSATION PREPARATION SUMMARY
Generated Date: ${summary.generatedDate}
Patient: ${userProfile.name} (Age ${userProfile.age}, ${userProfile.gender})

1. PATIENT OVERVIEW:
${summary.patientOverview}

2. KEY ABNORMAL LAB FINDINGS:
${summary.keyAbnormalities?.map((a) => `• ${a}`).join('\n')}

3. ACTIVE MEDICATIONS:
${summary.medicationSummary?.map((m) => `• ${m}`).join('\n')}

4. DIETARY & LIFESTYLE FOCUS:
${summary.dietaryPlanOverview}
${summary.lifestyleActionPlan?.map((l) => `• ${l}`).join('\n')}

5. QUESTIONS TO ASK YOUR DOCTOR:
${summary.questionsToAskDoctor?.map((q, i) => `${i + 1}. ${q}`).join('\n')}

6. RECOMMENDED FOLLOW-UP TIMELINE:
${summary.recommendedFollowUpIntervals}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wide">
            <FileCheck className="w-4 h-4 text-sky-400" />
            <span>Module 14 — Clinical Health Summary Generator</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">One-Page Doctor Appointment Preparation Summary</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesizes abnormal lab findings, active medications, lifestyle steps, and tailored questions for your physician.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Sparkles className="w-4 h-4 text-sky-400" />}
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleCopyText}
            disabled={!summary}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={() => window.print()}
            disabled={!summary}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5 transition-colors"
            id="btn-print-summary"
          >
            <Printer className="w-4 h-4" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Printable Summary Sheet Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl relative" id="printable-health-summary">
        {isGenerating ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">Synthesizing clinical summary from active reports and profile...</p>
          </div>
        ) : summary ? (
          <>
            {/* Header Document Banner */}
            <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">AI HEALTH ASSISTANT REPORT</div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Clinical Conversation Summary</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Prepared for: <strong className="text-white">{userProfile.name}</strong> • Age {userProfile.age} ({userProfile.gender})
                </p>
              </div>

              <div className="text-right text-xs text-slate-400">
                <div>Date Generated: <strong className="text-slate-200">{summary.generatedDate}</strong></div>
                <div>Primary Care Prep</div>
              </div>
            </div>

            {/* Section 1: Overview */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Stethoscope className="w-4 h-4" />
                <span>1. Patient Health Trajectory Overview</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {summary.patientOverview}
              </p>
            </div>

            {/* Grid: Section 2 Abnormalities & Section 3 Medications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Abnormal Labs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>2. Key Abnormal Lab Findings</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {summary.keyAbnormalities?.map((ab, i) => (
                    <li key={i}>{ab}</li>
                  ))}
                </ul>
              </div>

              {/* Active Regimen */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Pill className="w-4 h-4" />
                  <span>3. Active Prescribed Regimen</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {summary.medicationSummary?.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 4: Dietary & Lifestyle Plan */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Apple className="w-4 h-4" />
                <span>4. Dietary & Lifestyle Action Plan</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">{summary.dietaryPlanOverview}</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                {summary.lifestyleActionPlan?.map((ls, i) => (
                  <li key={i}>{ls}</li>
                ))}
              </ul>
            </div>

            {/* Section 5: Prioritized Questions for Doctor */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-5 rounded-xl border border-sky-500/30 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-sky-400" />
                <span>5. Recommended Questions to Discuss with Your Doctor</span>
              </h4>

              <div className="space-y-2 text-xs">
                {summary.questionsToAskDoctor?.map((q, i) => (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start space-x-2">
                    <span className="font-bold text-sky-400 shrink-0">{i + 1}.</span>
                    <span className="text-slate-200 font-medium">{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 6: Follow-Up Interval */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Recommended Follow-Up Interval:</span>
              </div>
              <strong className="text-emerald-300 font-bold">{summary.recommendedFollowUpIntervals}</strong>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
