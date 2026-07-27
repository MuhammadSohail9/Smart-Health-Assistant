import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, PhoneCall, X, Info } from 'lucide-react';

interface DisclaimerBannerProps {
  onDismissEmergencyAlert?: () => void;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = () => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <>
      {/* Medical Educational Disclaimer Banner */}
      <div className="bg-slate-900/90 border-b border-teal-500/20 text-slate-300 text-xs px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Educational Assistant:</strong> AI Health Assistant provides evidence-informed explanations and health summaries to prepare you for clinical conversations. It does not provide medical diagnoses or replace licensed physician care.
          </span>
        </div>
        <button
          onClick={() => setShowEmergencyModal(true)}
          className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded text-[11px] font-medium border border-amber-500/30 transition-colors shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Emergency Symptoms Warning</span>
        </button>
      </div>

      {/* Emergency Red Flags Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 text-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-rose-400">Emergency Warning & Red Flags</h3>
                <p className="text-xs text-slate-400">When to seek immediate emergency medical care</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              If you or someone around you is experiencing any of the following life-threatening red-flag symptoms, <strong className="text-white">do not rely on this app or wait for an AI response</strong>. Immediately call emergency services (e.g. <strong className="text-rose-400">911</strong> or your local emergency number) or go to the nearest emergency department:
            </p>

            <ul className="space-y-2 text-xs text-slate-300 mb-6 bg-rose-950/20 border border-rose-500/20 p-4 rounded-xl">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Chest Pain:</strong> Pressure, tightness, or pain in chest radiating to jaw, neck, or left arm.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Severe Shortness of Breath:</strong> Sudden, severe difficulty breathing at rest.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Stroke Symptoms (FAST):</strong> Sudden facial drooping, arm weakness, slurred speech, or confusion.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Loss of Consciousness or Sudden Fainting</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Severe Allergic Reaction:</strong> Swelling of lips/tongue, hives, difficulty swallowing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Uncontrolled Bleeding or Head Trauma</strong></span>
              </li>
            </ul>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold">
                <PhoneCall className="w-4 h-4" />
                <span>Call Emergency Services (911)</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
