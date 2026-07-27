import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Plus,
} from 'lucide-react';
import { MedicalReport, LabTestItem, UserProfile } from '../types';

interface ReportUploadProps {
  userProfile: UserProfile;
  reports: MedicalReport[];
  onAddReport: (report: MedicalReport) => void;
  selectedReport: MedicalReport | null;
  setSelectedReport: (report: MedicalReport | null) => void;
  onAskInChat: (question: string) => void;
}

export const ReportUpload: React.FC<ReportUploadProps> = ({
  userProfile,
  reports,
  onAddReport,
  selectedReport,
  setSelectedReport,
  onAskInChat,
}) => {
  const [reportText, setReportText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  // Default active report to first if none selected
  const activeReport = selectedReport || reports[0] || null;

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Perform AI analysis via Express backend /api/analyze-report
  const handleAnalyze = async () => {
    if (!reportText.trim() && !filePreview) {
      setError('Please upload a lab report image/PDF or paste report text.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textReport: reportText,
          imageBase64: filePreview,
          mimeType: selectedFile?.type || 'image/jpeg',
        }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to extract lab parameters from report.');
      }

      const parsed = result.data;
      const newReport: MedicalReport = {
        id: `rep_${Date.now()}`,
        title: parsed.reportType || 'Uploaded Medical Report',
        hospitalName: parsed.hospitalName || 'Clinical Laboratory',
        patientName: parsed.patientName || userProfile.name,
        testDate: parsed.testDate || new Date().toISOString().split('T')[0],
        doctorName: parsed.doctorName || 'Attending Physician',
        laboratoryName: parsed.laboratoryName || 'Medical Diagnostic Lab',
        reportType: parsed.reportType || 'General Lab Work',
        summaryText: parsed.summaryText || 'Report parsed successfully by AI Health Assistant.',
        overallFlag: parsed.overallFlag || 'Needs Attention',
        aiAnalysisDate: new Date().toISOString().split('T')[0],
        tests: (parsed.tests || []).map((t: any, idx: number) => ({
          id: `t_uploaded_${Date.now()}_${idx}`,
          testName: t.testName || 'Lab Biomarker',
          category: t.category || 'Metabolic',
          resultValue: t.resultValue || 'N/A',
          numericValue: t.numericValue,
          referenceRange: t.referenceRange || 'N/A',
          unit: t.unit || '',
          status: t.status || 'Normal',
          whatItMeasures: t.whatItMeasures || 'Measures standard biological analyte.',
          whyItMatters: t.whyItMatters || 'Evaluates physiological health balance.',
          possibleCauses: t.possibleCauses || ['Metabolic variation', 'Dietary factors'],
          lifestyleFactors: t.lifestyleFactors || ['Maintain balanced nutrition', 'Ensure adequate sleep'],
          questionsForDoctor: t.questionsForDoctor || ['What does this finding mean for my overall plan?'],
          associatedConditions: t.associatedConditions || [],
          followUpTests: t.followUpTests || [],
        })),
      };

      onAddReport(newReport);
      setSelectedReport(newReport);
      setReportText('');
      setSelectedFile(null);
      setFilePreview(null);
    } catch (err: any) {
      console.error('OCR & Analysis error:', err);
      setError(err.message || 'An error occurred while analyzing the report. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Pre-loaded realistic text sample
  const handleLoadSampleText = () => {
    setReportText(`METABOLIC & CARDIAC BLOOD PANEL
Hospital: St. Jude Medical Center
Date: 2026-07-20
Doctor: Dr. E. Vance, MD
Patient: Robert Miller

HbA1c: 8.2 % (Reference: 4.0 - 5.6 %) [HIGH]
Fasting Plasma Glucose: 165 mg/dL (Reference: 70 - 99 mg/dL) [HIGH]
Serum Creatinine: 1.1 mg/dL (Reference: 0.7 - 1.3 mg/dL) [NORMAL]
eGFR: 82 mL/min/1.73m2 (Reference: > 60) [NORMAL]
Total Cholesterol: 238 mg/dL (Reference: < 200 mg/dL) [HIGH]
LDL Cholesterol: 152 mg/dL (Reference: < 100 mg/dL) [HIGH]
HDL Cholesterol: 42 mg/dL (Reference: > 40 mg/dL) [NORMAL]
Triglycerides: 210 mg/dL (Reference: < 150 mg/dL) [HIGH]
Serum ALT: 32 U/L (Reference: 7 - 56 U/L) [NORMAL]
Serum AST: 28 U/L (Reference: 10 - 40 U/L) [NORMAL]
25-OH Vitamin D: 19 ng/mL (Reference: 30 - 100 ng/mL) [LOW]`);
    setSelectedFile(null);
    setFilePreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Modules 3, 4 & 5 — OCR & AI Report Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Medical Report Upload & AI Lab Interpretation</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload PDF/JPG reports or paste text results for instant OCR parameter extraction, abnormal value flagging, and evidence-informed explanations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {reports.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeReport?.id === r.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r.title.split(' ')[0]} ({r.testDate})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload Form on Left, Active Report View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Upload Controls & Input */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Upload New Report</span>
            </h3>

            {/* File Drag & Drop Dropzone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-4 text-center bg-slate-950/50 transition-colors relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                {selectedFile ? (
                  <div>
                    <span className="text-xs font-semibold text-emerald-300 block">{selectedFile.name}</span>
                    <span className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-medium text-slate-300 block">Click or Drag PDF / Image report here</span>
                    <span className="text-[10px] text-slate-500">Supports JPG, PNG, HEIC, PDF</span>
                  </div>
                )}
              </div>
            </div>

            {/* File Image Preview if available */}
            {filePreview && (
              <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-32">
                <img src={filePreview} alt="Report Preview" className="w-full object-cover" />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-slate-900/90 text-slate-300 p-1 rounded text-xs hover:bg-rose-600"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2 my-2">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-[10px] text-slate-500 uppercase font-bold">OR PASTE TEXT</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            {/* Text Report Area */}
            <div>
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste raw lab report text e.g. HbA1c 8.2% (ref 4.0-5.6), Glucose 165 mg/dL..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 h-28 resize-none"
              />
              <div className="flex justify-end mt-1">
                <button
                  onClick={handleLoadSampleText}
                  className="text-[11px] text-teal-400 hover:underline flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Insert Sample Report Text</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
              id="btn-process-report-ai"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing OCR & Gemini AI Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Report with Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (7 cols): Active Report Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {activeReport ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              {/* Report Header Metadata */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeReport.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {activeReport.hospitalName || 'Clinical Diagnostics'} • Date: {activeReport.testDate}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    activeReport.overallFlag === 'Normal'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    Overall Status: {activeReport.overallFlag}
                  </span>
                </div>

                {/* AI Summary Banner */}
                <div className="mt-3 bg-slate-950/80 border border-emerald-500/20 p-3.5 rounded-xl text-xs text-slate-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Clinical Impression</span>
                  </div>
                  <p className="leading-relaxed">{activeReport.summaryText}</p>
                </div>
              </div>

              {/* Lab Test Items Catalog */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Parsed Biomarkers ({activeReport.tests.length})
                </h4>

                <div className="space-y-3">
                  {activeReport.tests.map((test) => {
                    const isExpanded = expandedTestId === test.id;
                    const isAbnormal = test.status !== 'Normal';

                    return (
                      <div
                        key={test.id}
                        className={`bg-slate-950/70 border rounded-xl overflow-hidden transition-all ${
                          isAbnormal ? 'border-amber-500/30' : 'border-slate-800'
                        }`}
                      >
                        {/* Test Card Header Bar */}
                        <div
                          onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-slate-100">{test.testName}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.2 rounded">
                                {test.category}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              Reference Range: <span className="text-slate-300">{test.referenceRange}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right">
                              <div className="text-sm font-extrabold text-white">{test.resultValue}</div>
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full inline-block mt-0.5 ${
                                test.status === 'High'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : test.status === 'Low'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {test.status}
                              </span>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Expandable AI Analysis Body */}
                        {isExpanded && (
                          <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 text-xs text-slate-300 space-y-3 animate-in fade-in duration-150">
                            {test.whatItMeasures && (
                              <div>
                                <span className="text-emerald-400 font-bold block mb-0.5">What it Measures & Why it Matters:</span>
                                <p className="leading-relaxed text-slate-300">{test.whatItMeasures} {test.whyItMatters}</p>
                              </div>
                            )}

                            {test.possibleCauses && test.possibleCauses.length > 0 && (
                              <div>
                                <span className="text-amber-400 font-bold block mb-0.5">Possible Non-Diagnostic Factors:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                                  {test.possibleCauses.map((c, i) => (
                                    <li key={i}>{c}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {test.lifestyleFactors && test.lifestyleFactors.length > 0 && (
                              <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg">
                                <span className="text-emerald-300 font-bold block mb-0.5">Diet & Lifestyle Considerations:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-emerald-200">
                                  {test.lifestyleFactors.map((lf, i) => (
                                    <li key={i}>{lf}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {test.questionsForDoctor && test.questionsForDoctor.length > 0 && (
                              <div className="bg-sky-950/20 border border-sky-500/20 p-2.5 rounded-lg">
                                <span className="text-sky-300 font-bold block mb-0.5">Questions to Discuss with Your Doctor:</span>
                                <ul className="list-disc list-inside space-y-0.5 text-sky-200">
                                  {test.questionsForDoctor.map((q, i) => (
                                    <li key={i}>{q}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px]">
                              <button
                                onClick={() => onAskInChat(`Why is my ${test.testName} level ${test.resultValue}? What should I ask my doctor?`)}
                                className="text-emerald-400 hover:underline flex items-center space-x-1"
                              >
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>Ask AI Assistant About This Result</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">No medical reports loaded yet.</p>
              <p className="text-xs text-slate-500 mt-1">Upload a report or click "Insert Sample Report Text" on the left to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
