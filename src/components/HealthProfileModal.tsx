import React, { useState } from 'react';
import { User, X, Check, Activity, Heart, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface HealthProfileModalProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export const HealthProfileModal: React.FC<HealthProfileModalProps> = ({
  userProfile,
  onSaveProfile,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });

  // Handle BMI Recalculation
  const handleWeightHeightChange = (weight: number, height: number) => {
    const heightM = height / 100;
    const computedBmi = heightM > 0 ? parseFloat((weight / (heightM * heightM)).toFixed(1)) : profile.bmi;
    setProfile((prev) => ({
      ...prev,
      weightKg: weight,
      heightCm: height,
      bmi: computedBmi,
    }));
  };

  const handleToggleCondition = (key: keyof UserProfile['conditions']) => {
    if (key === 'familyHistory') return;
    setProfile((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: !prev.conditions[key],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-200 shadow-2xl relative my-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Modules 1 & 2 — User Health Profile</h3>
            <p className="text-xs text-slate-400">Personalize demographics, active conditions, and lifestyle habits</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Section 1: Demographics */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">1. Demographics & Vitals</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Age (years)</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || profile.age })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) => handleWeightHeightChange(profile.weightKg, parseInt(e.target.value) || 170)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weightKg}
                  onChange={(e) => handleWeightHeightChange(parseFloat(e.target.value) || 70, profile.heightCm)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Calculated BMI</label>
                <input
                  type="text"
                  value={`${profile.bmi} kg/m²`}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Chronic Conditions Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">2. Known Chronic Conditions</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'diabetes', label: 'Type 2 Diabetes' },
                { key: 'hypertension', label: 'Hypertension' },
                { key: 'heartDisease', label: 'Heart Disease' },
                { key: 'kidneyDisease', label: 'Kidney Disease' },
                { key: 'liverDisease', label: 'Liver Disease' },
                { key: 'thyroidDisease', label: 'Thyroid Condition' },
                { key: 'asthma', label: 'Asthma' },
                { key: 'cancerHistory', label: 'Cancer History' },
              ].map(({ key, label }) => {
                const active = profile.conditions[key as keyof UserProfile['conditions']] as boolean;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleCondition(key as keyof UserProfile['conditions'])}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      active
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{label}</span>
                    {active && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Lifestyle Habits */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">3. Lifestyle Factors</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Exercise Frequency</label>
                <select
                  value={profile.exerciseFrequency}
                  onChange={(e) => setProfile({ ...profile, exerciseFrequency: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="1-2 times/week">1-2 times/week</option>
                  <option value="3-4 times/week">3-4 times/week</option>
                  <option value="5+ times/week">5+ times/week</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Sleep (hours/night)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.sleepHours}
                  onChange={(e) => setProfile({ ...profile, sleepHours: parseFloat(e.target.value) || 7 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Daily Water (Liters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={profile.waterIntakeLiters}
                  onChange={(e) => setProfile({ ...profile, waterIntakeLiters: parseFloat(e.target.value) || 2 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl shadow-md"
              id="btn-save-profile-submit"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
