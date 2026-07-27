import React, { useState, useEffect } from 'react';
import {
  Apple,
  Activity,
  Droplets,
  Moon,
  Brain,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Utensils,
  Zap,
  HelpCircle,
  Flame,
} from 'lucide-react';
import {
  UserProfile,
  MedicalReport,
  FoodRecommendation,
  LifestyleRecommendation,
} from '../types';

interface DietLifestyleCoachProps {
  userProfile: UserProfile;
  reports: MedicalReport[];
  onAskInChat: (question: string) => void;
}

export const DietLifestyleCoach: React.FC<DietLifestyleCoachProps> = ({
  userProfile,
  reports,
  onAskInChat,
}) => {
  const [foodRec, setFoodRec] = useState<FoodRecommendation | null>(null);
  const [lifestyleRecs, setLifestyleRecs] = useState<LifestyleRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  // Collect current active lab results for personalized AI dietary synthesis
  const activeLabs = reports.flatMap((r) => r.tests);

  // Generate personalized diet and lifestyle advice
  const fetchDietAndLifestyle = async () => {
    setLoading(true);
    try {
      const [foodRes, lifestyleRes] = await Promise.all([
        fetch('/api/food-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile, labResults: activeLabs }),
        }),
        fetch('/api/lifestyle-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile, labResults: activeLabs }),
        }),
      ]);

      const foodData = await foodRes.json();
      const lifestyleData = await lifestyleRes.json();

      if (foodData.success) setFoodRec(foodData.data);
      if (lifestyleData.success) setLifestyleRecs(lifestyleData.data);
    } catch (error) {
      console.error('Error fetching dietary & lifestyle advice:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietAndLifestyle();
  }, [userProfile.id]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-teal-400 uppercase tracking-wide">
            <Apple className="w-4 h-4 text-teal-400" />
            <span>Modules 9 & 10 — Food Recommendation Engine & Lifestyle Coach</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Personalized Nutrition & Evidence-Based Lifestyle Plan</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted dietary guidance tailored to your blood profile (HbA1c 7.2%, Cholesterol 228 mg/dL) and active health conditions.
          </p>
        </div>

        <button
          onClick={fetchDietAndLifestyle}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-2 shrink-0"
          id="btn-refresh-nutrition-plan"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Synthesizing Nutrition...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Regenerate Nutrition Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Module 9 — Food Recommendation Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Dietary Strategy: {foodRec?.condition || 'Type 2 Diabetes & Cardiovascular Health'}
              </h3>
              <p className="text-xs text-slate-400">Low Glycemic Index • Soluble Fiber Focus • Heart-Healthy Fats</p>
            </div>
          </div>

          <button
            onClick={() => onAskInChat('Can you suggest a 7-day diabetes and low-cholesterol meal plan for me?')}
            className="text-xs text-teal-400 hover:underline flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Assistant for Custom Recipes</span>
          </button>
        </div>

        {/* Recommended Foods vs Foods to Limit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Foods to Enjoy */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Foods to Enjoy</span>
            </div>

            <div className="space-y-2.5">
              {(foodRec?.recommendedFoods || [
                { name: 'Oats & Soluble Fiber', category: 'Whole Grains', benefits: 'Binds cholesterol in digestive tract, slowing glucose spike' },
                { name: 'Wild Salmon & Mackerel', category: 'Proteins', benefits: 'Rich in Omega-3 fatty acids, supports arterial vascular elasticity' },
                { name: 'Avocados & Extra Virgin Olive Oil', category: 'Healthy Fats', benefits: 'Monounsaturated fats improve lipid profiles and insulin sensitivity' },
                { name: 'Lentils & Beans', category: 'Legumes', benefits: 'High protein and complex fiber with minimal glycemic impact' },
                { name: 'Leafy Greens (Spinach, Kale)', category: 'Vegetables', benefits: 'Abundant magnesium and antioxidants to protect vascular tissue' },
              ]).map((f, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">{f.name}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded font-medium">
                      {f.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">{f.benefits}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Foods to Limit */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <XCircle className="w-4 h-4" />
              <span>Foods & Drinks to Limit or Avoid</span>
            </div>

            <div className="space-y-2.5">
              {(foodRec?.foodsToLimit || [
                { name: 'Sugar-Sweetened Beverages & Soda', reason: 'Rapidly spikes blood glucose and increases visceral liver fat' },
                { name: 'Refined Carbohydrates (White Bread/Pastry)', reason: 'High glycemic load triggers excess insulin demand' },
                { name: 'Processed Meats & Trans Fats', reason: 'Raises LDL cholesterol and promotes arterial endothelial inflammation' },
                { name: 'High-Sodium Canned Foods', reason: 'Exacerbates fluid retention and elevates systemic blood pressure' },
              ]).map((fl, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-rose-300">{fl.name}</div>
                  <p className="text-[11px] text-slate-400 leading-normal">{fl.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Meal Plan Ideas */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Balanced Sample Daily Meal Structure</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <span className="font-bold text-amber-300 block">🌅 Breakfast</span>
              <p className="text-slate-300 text-[11px]">
                {foodRec?.sampleMealIdeas?.breakfast || 'Steel-cut oats with chia seeds, ground flaxseed, and fresh blueberries.'}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <span className="font-bold text-sky-300 block">☀️ Lunch</span>
              <p className="text-slate-300 text-[11px]">
                {foodRec?.sampleMealIdeas?.lunch || 'Grilled salmon salad over spinach, cucumber, cherry tomatoes with olive oil dressing.'}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <span className="font-bold text-indigo-300 block">🌙 Dinner</span>
              <p className="text-slate-300 text-[11px]">
                {foodRec?.sampleMealIdeas?.dinner || 'Baked chicken breast, steamed broccoli, and quinoa.'}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-1">
              <span className="font-bold text-emerald-300 block">🥑 Snacks</span>
              <p className="text-slate-300 text-[11px]">
                {foodRec?.sampleMealIdeas?.snacks || 'Handful of raw walnuts, unsalted almonds, or Greek yogurt.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Module 10 — Lifestyle Coach */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Evidence-Informed Lifestyle Coach</h3>
            <p className="text-xs text-slate-400">Actionable habits for cardiovascular health, glycemic control, and stress resilience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(lifestyleRecs.length > 0 ? lifestyleRecs : [
            {
              category: 'Exercise',
              title: '30-Minute Post-Meal Brisk Walk',
              advice: 'Walking for 10-15 minutes after meals lowers postprandial glucose spikes by directing sugar into muscle tissues.',
              actionableSteps: ['Aim for 10,000 steps daily', 'Add light resistance training 2 days/week'],
              impactScore: 'High Impact',
            },
            {
              category: 'Hydration',
              title: 'Target 2.0 - 2.5 Liters Water Daily',
              advice: 'Proper hydration assists kidney filtration (eGFR support) and aids metabolic waste elimination.',
              actionableSteps: ['Drink 1 glass of water upon waking', 'Carry a reusable water bottle during work hours'],
              impactScore: 'Moderate Impact',
            },
            {
              category: 'Sleep Hygiene',
              title: '7-8 Hours Consistent Sleep',
              advice: 'Inadequate sleep increases cortisol and fasting insulin resistance, impairing glycemic control.',
              actionableSteps: ['Maintain consistent bedtime at 10:30 PM', 'Avoid blue-light screens 1 hour before bed'],
              impactScore: 'High Impact',
            },
            {
              category: 'Stress Reduction',
              title: 'Diaphragmatic Breathing & Meditation',
              advice: 'Chronic stress triggers adrenaline and cortisol release, elevating both blood pressure and glucose.',
              actionableSteps: ['Practice 5-minute deep breathing twice daily', 'Take short stretch breaks during work'],
              impactScore: 'Moderate Impact',
            },
            {
              category: 'Substance Use',
              title: 'Alcohol Moderation & Tobacco Control',
              advice: 'Alcohol adds empty calories and elevates triglyceride levels. Tobacco severely damages arterial walls.',
              actionableSteps: ['Limit alcohol to < 2 drinks per week', 'Access smoking cessation resources if applicable'],
              impactScore: 'High Impact',
            },
          ]).map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-emerald-400 uppercase tracking-wide">{item.category}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                    {item.impactScore}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.advice}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Action Steps:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                  {item.actionableSteps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
