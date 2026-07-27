import React, { useState } from 'react';
import { HealthTab, UserProfile, MedicalReport, Medication, TrendDataPoint, ReminderItem } from './types';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_HEALTH_SCORES,
  SAMPLE_REPORTS,
  INITIAL_MEDICATIONS,
  INITIAL_TRENDS,
  INITIAL_REMINDERS,
} from './data/mockData';

import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { HealthDashboard } from './components/HealthDashboard';
import { ReportUpload } from './components/ReportUpload';
import { MedicationManager } from './components/MedicationManager';
import { DietLifestyleCoach } from './components/DietLifestyleCoach';
import { ChatAssistant } from './components/ChatAssistant';
import { ProgressTracker } from './components/ProgressTracker';
import { KnowledgeBase } from './components/KnowledgeBase';
import { HealthSummaryView } from './components/HealthSummaryView';
import { RemindersView } from './components/RemindersView';
import { HealthProfileModal } from './components/HealthProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<HealthTab>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [healthScores, setHealthScores] = useState(INITIAL_HEALTH_SCORES);
  const [reports, setReports] = useState<MedicalReport[]>(SAMPLE_REPORTS);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(SAMPLE_REPORTS[0] || null);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [trends, setTrends] = useState<TrendDataPoint[]>(INITIAL_TRENDS);
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);

  // Modals & Chat jump states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);

  // Handlers
  const handleAddReport = (newReport: MedicalReport) => {
    setReports((prev) => [newReport, ...prev]);
    setSelectedReport(newReport);
  };

  const handleAddMedication = (newMed: Medication) => {
    setMedications((prev) => [newMed, ...prev]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddTrendPoint = (point: TrendDataPoint) => {
    setTrends((prev) => [...prev, point]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completedToday: !r.completedToday } : r))
    );
  };

  const handleAddReminder = (reminder: ReminderItem) => {
    setReminders((prev) => [reminder, ...prev]);
  };

  const handleRemoveReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAskInChat = (question: string) => {
    setChatInitialQuestion(question);
    setActiveTab('chat');
  };

  const unreadRemindersCount = reminders.filter((r) => !r.completedToday).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        unreadRemindersCount={unreadRemindersCount}
      />

      {/* Persistent Disclaimer Banner & Emergency Red Flag Alert */}
      <DisclaimerBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <HealthDashboard
            userProfile={userProfile}
            healthScores={healthScores}
            reports={reports}
            medications={medications}
            reminders={reminders}
            setActiveTab={setActiveTab}
            onSelectReport={(r) => setSelectedReport(r)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'upload' && (
          <ReportUpload
            userProfile={userProfile}
            reports={reports}
            onAddReport={handleAddReport}
            selectedReport={selectedReport}
            setSelectedReport={setSelectedReport}
            onAskInChat={handleAskInChat}
          />
        )}

        {activeTab === 'medications' && (
          <MedicationManager
            userProfile={userProfile}
            medications={medications}
            onAddMedication={handleAddMedication}
            onRemoveMedication={handleRemoveMedication}
            onAskInChat={handleAskInChat}
          />
        )}

        {activeTab === 'nutrition' && (
          <DietLifestyleCoach
            userProfile={userProfile}
            reports={reports}
            onAskInChat={handleAskInChat}
          />
        )}

        {activeTab === 'chat' && (
          <ChatAssistant
            userProfile={userProfile}
            reports={reports}
            medications={medications}
            initialQuestion={chatInitialQuestion}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker
            userProfile={userProfile}
            trends={trends}
            onAddTrendPoint={handleAddTrendPoint}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBase onAskInChat={handleAskInChat} />
        )}

        {activeTab === 'summary' && (
          <HealthSummaryView
            userProfile={userProfile}
            reports={reports}
            medications={medications}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersView
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onAddReminder={handleAddReminder}
            onRemoveReminder={handleRemoveReminder}
          />
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p>© 2026 AI Health Assistant • Powered by Google Gemini AI</p>
          <p className="text-[11px] text-slate-600">
            AI Health Assistant is designed for educational & personal health management purposes only. It is not a medical device and does not substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>

      {/* User Profile Editor Modal */}
      {isProfileModalOpen && (
        <HealthProfileModal
          userProfile={userProfile}
          onSaveProfile={(updated) => setUserProfile(updated)}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
}
