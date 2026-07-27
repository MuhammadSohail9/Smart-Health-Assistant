export type HealthTab =
  | 'dashboard'
  | 'upload'
  | 'knowledge'
  | 'medications'
  | 'nutrition'
  | 'chat'
  | 'progress'
  | 'summary'
  | 'reminders';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodGroup: string;
  country: string;
  emergencyContact: string;
  
  // Health Conditions
  conditions: {
    diabetes: boolean;
    hypertension: boolean;
    heartDisease: boolean;
    kidneyDisease: boolean;
    liverDisease: boolean;
    thyroidDisease: boolean;
    asthma: boolean;
    cancerHistory: boolean;
    familyHistory: string[];
  };

  // Lifestyle Factors
  smoking: 'Never' | 'Former' | 'Occasional' | 'Regular';
  alcohol: 'None' | 'Occasional' | 'Moderate' | 'Heavy';
  pregnancyStatus: 'Not Applicable' | 'Not Pregnant' | 'Pregnant' | 'Nursing';
  exerciseFrequency: 'Sedentary' | '1-2 times/week' | '3-4 times/week' | '5+ times/week';
  sleepHours: number;
  stressLevel: 'Low' | 'Moderate' | 'High';
  waterIntakeLiters: number;

  // Allergies
  foodAllergies: string[];
  drugAllergies: string[];
}

export interface LabTestItem {
  id: string;
  testName: string;
  category: 'CBC' | 'Metabolic' | 'Lipid' | 'Liver' | 'Kidney' | 'Thyroid' | 'Vitamins' | 'Hormones' | 'Other';
  resultValue: string;
  numericValue?: number;
  referenceRange: string;
  unit: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical';
  
  // AI Interpretation
  whatItMeasures?: string;
  whyItMatters?: string;
  possibleCauses?: string[];
  lifestyleFactors?: string[];
  questionsForDoctor?: string[];
  associatedConditions?: string[];
  followUpTests?: string[];
}

export interface MedicalReport {
  id: string;
  title: string;
  hospitalName?: string;
  patientName?: string;
  testDate: string;
  doctorName?: string;
  laboratoryName?: string;
  reportType: string;
  summaryText: string;
  overallFlag: 'Normal' | 'Needs Attention' | 'Abnormal';
  tests: LabTestItem[];
  aiAnalysisDate?: string;
}

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  duration: string;
  reason: string;
  timeOfDay?: string[];
  
  // AI review details
  purpose?: string;
  commonSideEffects?: string[];
  howToTake?: string;
  foodInteractions?: string;
  alcoholInteractions?: string;
  missedDoseGuidance?: string;
  storageInstructions?: string;
  monitoringNeeded?: string;
  whenToSeekMedicalHelp?: string;
}

export interface DrugInteraction {
  drugA: string;
  drugB: string;
  severity: 'Major' | 'Moderate' | 'Minor';
  description: string;
  recommendation: string;
}

export interface DrugInteractionCheckResult {
  interactions: DrugInteraction[];
  foodInteractions: string[];
  alcoholWarnings: string[];
  conditionPrecautions: string[]; // e.g. Kidney/Liver/Pregnancy warnings
  summaryAdvice: string;
}

export interface FoodItem {
  name: string;
  category: string;
  benefits: string;
  iconName?: string;
}

export interface FoodRecommendation {
  condition: string;
  recommendedFoods: FoodItem[];
  foodsToLimit: { name: string; reason: string }[];
  sampleMealIdeas: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  };
  keyNutritionalFocus: string[];
}

export interface LifestyleRecommendation {
  category: 'Exercise' | 'Hydration' | 'Sleep' | 'Stress' | 'Screen Time' | 'Substance Use';
  title: string;
  advice: string;
  actionableSteps: string[];
  impactScore: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isEmergencyAlert?: boolean;
  suggestedFollowUps?: string[];
}

export interface TrendDataPoint {
  date: string;
  weight?: number;
  sysBP?: number;
  diaBP?: number;
  hba1c?: number;
  glucose?: number;
  cholesterol?: number;
  ldl?: number;
  hdl?: number;
  triglycerides?: number;
  creatinine?: number;
  egfr?: number;
  vitaminD?: number;
}

export interface HealthScores {
  overallScore: number;
  diabetesRisk: 'Low' | 'Moderate' | 'Elevated' | 'High';
  heartHealthScore: number;
  kidneyHealthScore: number;
  liverHealthScore: number;
  nutritionScore: number;
  activityScore: number;
  sleepScore: number;
  hydrationScore: number;
  stressScore: number;
}

export interface KnowledgeArticle {
  id: string;
  testName: string;
  shortName: string;
  category: string;
  definition: string;
  normalRange: string;
  unit: string;
  highCauses: string[];
  lowCauses: string[];
  symptoms: string[];
  typicalEvaluation: string;
  lifestyleConsiderations: string[];
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'Medication' | 'Hydration' | 'Exercise' | 'Lab Recheck' | 'Doctor Appointment' | 'Sleep';
  time: string;
  frequency: string;
  completedToday: boolean;
  notes?: string;
}

export interface HealthSummary {
  generatedDate: string;
  patientOverview: string;
  keyAbnormalities: string[];
  medicationSummary: string[];
  dietaryPlanOverview: string;
  lifestyleActionPlan: string[];
  questionsToAskDoctor: string[];
  recommendedFollowUpIntervals: string;
}
