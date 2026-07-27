import React, { useState } from 'react';
import {
  Pill,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Sparkles,
  Loader2,
  CheckCircle,
  X,
  Info,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  Medication,
  UserProfile,
  DrugInteractionCheckResult,
} from '../types';

interface MedicationManagerProps {
  userProfile: UserProfile;
  medications: Medication[];
  onAddMedication: (med: Medication) => void;
  onRemoveMedication: (id: string) => void;
  onAskInChat: (question: string) => void;
}

export const MedicationManager: React.FC<MedicationManagerProps> = ({
  userProfile,
  medications,
  onAddMedication,
  onRemoveMedication,
  onAskInChat,
}) => {
  // New drug form state
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedReason, setNewMedReason] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // Interaction check result state
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);
  const [interactionResult, setInteractionResult] = useState<DrugInteractionCheckResult | null>(null);
  const [selectedMedForDetail, setSelectedMedForDetail] = useState<Medication | null>(
    medications[0] || null
  );

  // Add medication and generate AI review
  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    setIsReviewing(true);
    try {
      const response = await fetch('/api/medication-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicineName: newMedName,
          dose: newMedDose || 'As prescribed',
          frequency: newMedFreq || 'Daily',
          reason: newMedReason || 'Health management',
          userProfile,
        }),
      });

      const result = await response.json();
      const aiData = result.data || {};

      const newMed: Medication = {
        id: `med_${Date.now()}`,
        name: newMedName,
        dose: newMedDose || '500 mg',
        frequency: newMedFreq || 'Daily',
        duration: 'Ongoing',
        reason: newMedReason || 'Prescribed therapy',
        purpose: aiData.purpose || 'Medication therapy as instructed by healthcare provider.',
        commonSideEffects: aiData.commonSideEffects || ['Mild nausea', 'Headache'],
        howToTake: aiData.howToTake || 'Take with water as directed by your physician.',
        foodInteractions: aiData.foodInteractions || 'Maintain balanced dietary intake.',
        alcoholInteractions: aiData.alcoholInteractions || 'Limit or avoid alcohol intake.',
        missedDoseGuidance: aiData.missedDoseGuidance || 'Take as soon as remembered; do not double dose.',
        storageInstructions: aiData.storageInstructions || 'Store at room temperature.',
        monitoringNeeded: aiData.monitoringNeeded || 'Periodic blood pressure or routine labs.',
        whenToSeekMedicalHelp: aiData.whenToSeekMedicalHelp || 'Seek medical care if experiencing severe adverse reactions.',
      };

      onAddMedication(newMed);
      setSelectedMedForDetail(newMed);
      setNewMedName('');
      setNewMedDose('');
      setNewMedFreq('');
      setNewMedReason('');
    } catch (error) {
      console.error('Error reviewing medication:', error);
    } finally {
      setIsReviewing(false);
    }
  };

  // Run Drug Interaction Checker for all current active medications
  const handleCheckInteractions = async () => {
    if (medications.length === 0) return;

    setIsCheckingInteractions(true);
    try {
      const response = await fetch('/api/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medications,
          userProfile,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setInteractionResult(result.data);
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wide">
            <Pill className="w-4 h-4 text-sky-400" />
            <span>Modules 7 & 8 — Medication Review & Drug Interaction Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Prescribed Medication & Drug Interaction Analysis</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review drug safety profiles, check multi-drug and food-drug interactions, and receive general guidance on administration and precautions.
          </p>
        </div>

        <button
          onClick={handleCheckInteractions}
          disabled={isCheckingInteractions || medications.length === 0}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0"
          id="btn-run-drug-interaction-checker"
        >
          {isCheckingInteractions ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Drug Interactions...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Run Multi-Drug Interaction Check ({medications.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Drug Interaction Alert Panel if checked */}
      {interactionResult && (
        <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white">Multi-Drug Interaction Analysis Report</h3>
            </div>
            <button
              onClick={() => setInteractionResult(null)}
              className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded-lg"
            >
              Close Results
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
            {interactionResult.summaryAdvice}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Direct Drug-Drug Interactions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Drug-Drug Interactions ({interactionResult.interactions?.length || 0})</span>
              </h4>

              {(!interactionResult.interactions || interactionResult.interactions.length === 0) ? (
                <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs p-3 rounded-xl flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>No major direct drug-drug interactions detected between current active medications.</span>
                </div>
              ) : (
                interactionResult.interactions.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs space-y-1 border ${
                      item.severity === 'Major'
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : item.severity === 'Moderate'
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{item.drugA} ↔ {item.drugB}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-extrabold ${
                        item.severity === 'Major' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}>
                        {item.severity} Severity
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed pt-1">{item.description}</p>
                    <div className="text-[11px] font-semibold text-slate-300 pt-1 border-t border-slate-800/80">
                      💡 Advice: {item.recommendation}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Food, Alcohol & Condition Warnings */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Food, Alcohol & Condition Safety Precautions</span>
              </h4>

              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs space-y-2.5">
                <div>
                  <span className="font-bold text-amber-300 block mb-0.5">Food & Beverage Warnings:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {interactionResult.foodInteractions?.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-bold text-sky-300 block mb-0.5">Alcohol Precautions:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {interactionResult.alcoholWarnings?.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>

                {interactionResult.conditionPrecautions && interactionResult.conditionPrecautions.length > 0 && (
                  <div>
                    <span className="font-bold text-emerald-300 block mb-0.5">Kidney, Liver & Organ Considerations:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                      {interactionResult.conditionPrecautions.map((cp, i) => (
                        <li key={i}>{cp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Medication Form & List on Left, Selected Drug AI Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Medication List & Add Form */}
        <div className="lg:col-span-5 space-y-5">
          {/* Add Medication Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Plus className="w-4 h-4 text-sky-400" />
              <span>Add Prescribed Medication</span>
            </h3>

            <form onSubmit={handleAddMed} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Medication Name *</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Atorvastatin, Metformin, Lisinopril..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Dose</label>
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="e.g. 10 mg"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    placeholder="e.g. Once daily at night"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Reason for Prescription</label>
                <input
                  type="text"
                  value={newMedReason}
                  onChange={(e) => setNewMedReason(e.target.value)}
                  placeholder="e.g. High cholesterol, Blood pressure control"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={isReviewing || !newMedName.trim()}
                className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
                id="btn-add-medication-submit"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Medication with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Add & Generate AI Drug Guide</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Medications List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Active Prescribed Regimen ({medications.length})
            </h3>

            <div className="space-y-2.5">
              {medications.map((med) => {
                const isSelected = selectedMedForDetail?.id === med.id;
                return (
                  <div
                    key={med.id}
                    onClick={() => setSelectedMedForDetail(med)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-sky-500/50 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{med.name}</span>
                        <span className="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.2 rounded font-medium">
                          {med.dose}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{med.frequency} • {med.reason}</div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveMedication(med.id);
                        if (selectedMedForDetail?.id === med.id) {
                          setSelectedMedForDetail(null);
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800"
                      title="Remove Medication"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Selected Medication AI Guide */}
        <div className="lg:col-span-7">
          {selectedMedForDetail ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{selectedMedForDetail.name}</h3>
                    <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/30">
                      {selectedMedForDetail.dose}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Frequency: {selectedMedForDetail.frequency} • Reason: {selectedMedForDetail.reason}
                  </p>
                </div>

                <button
                  onClick={() => onAskInChat(`Can you explain side effects and food precautions for ${selectedMedForDetail.name}?`)}
                  className="bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              {/* Drug Purpose */}
              {selectedMedForDetail.purpose && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-sky-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>How it Works & Therapeutic Purpose</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedMedForDetail.purpose}</p>
                </div>
              )}

              {/* Grid of Medication Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Common Side Effects */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-300 block">Common Side Effects:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                    {selectedMedForDetail.commonSideEffects?.map((se, i) => (
                      <li key={i}>{se}</li>
                    ))}
                  </ul>
                </div>

                {/* Administration Instructions */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-emerald-300 block">Administration Instructions:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedMedForDetail.howToTake}</p>
                </div>

                {/* Food & Alcohol Interactions */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-sky-300 block">Food & Drink Considerations:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedMedForDetail.foodInteractions}</p>
                  <p className="text-slate-400 text-[11px] pt-1">🍷 Alcohol: {selectedMedForDetail.alcoholInteractions}</p>
                </div>

                {/* Missed Dose Guidance */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-indigo-300 block">Missed Dose Guidance:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedMedForDetail.missedDoseGuidance}</p>
                </div>
              </div>

              {/* Monitoring & Red Flags */}
              <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl text-xs space-y-1">
                <span className="font-bold text-rose-300 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>When to Contact Your Physician Immediately</span>
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedMedForDetail.whenToSeekMedicalHelp}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <Pill className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-semibold">Select a medication to view AI safety guide.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
