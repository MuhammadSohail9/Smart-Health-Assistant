import React from 'react';
import {
  Activity,
  FileText,
  Pill,
  Apple,
  MessageSquareText,
  TrendingUp,
  FileCheck,
  Bell,
  BookOpen,
  User,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import { HealthTab, UserProfile } from '../types';

interface HeaderProps {
  activeTab: HealthTab;
  setActiveTab: (tab: HealthTab) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  unreadRemindersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenProfile,
  unreadRemindersCount,
}) => {
  const navItems: { id: HealthTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'upload', label: 'Analyze Report', icon: <FileText className="w-4 h-4" /> },
    { id: 'medications', label: 'Medications', icon: <Pill className="w-4 h-4" /> },
    { id: 'nutrition', label: 'Diet & Lifestyle', icon: <Apple className="w-4 h-4" /> },
    { id: 'chat', label: 'AI Health Chat', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'progress', label: 'Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'summary', label: 'Health Summary', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-900 font-bold shadow-md shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">AI Health Assistant</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                  Medical AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Report Analysis • Medications • Health Intelligence</p>
            </div>
          </div>

          {/* User Profile Quick Action & Emergency Notice */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('upload')}
              className="hidden md:flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
              id="btn-upload-report-header"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Report</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              id="btn-open-user-profile"
            >
              <div className="w-6 h-6 rounded-full bg-teal-600/30 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold">
                {userProfile.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-medium text-slate-200 leading-tight">{userProfile.name}</div>
                <div className="text-[10px] text-slate-400">{userProfile.age}y • {userProfile.gender}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-2 pt-1 border-t border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                id={`tab-${item.id}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'reminders' && unreadRemindersCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                    {unreadRemindersCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
