import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Circle,
  Plus,
  Pill,
  Droplets,
  Activity,
  Calendar,
  Clock,
  Trash2,
} from 'lucide-react';
import { ReminderItem } from '../types';

interface RemindersViewProps {
  reminders: ReminderItem[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: ReminderItem) => void;
  onRemoveReminder: (id: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onRemoveReminder,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderItem['type']>('Medication');
  const [time, setTime] = useState('08:00 AM');
  const [frequency, setFrequency] = useState('Daily');
  const [notes, setNotes] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRem: ReminderItem = {
      id: `rem_${Date.now()}`,
      title,
      type,
      time,
      frequency,
      completedToday: false,
      notes,
    };

    onAddReminder(newRem);
    setTitle('');
    setNotes('');
    setShowAddForm(false);
  };

  const completedCount = reminders.filter((r) => r.completedToday).length;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wide">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Module 15 — Medication Schedules & Health Reminders</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Daily Health Routine & Recheck Tracker</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Never miss a prescription dose, hydration check-in, exercise session, or routine lab recheck.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
          id="btn-toggle-add-reminder"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Reminder</span>
        </button>
      </div>

      {/* Daily Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-300">Today's Schedule Progress</div>
          <div className="text-sm font-extrabold text-amber-400">
            {completedCount} of {reminders.length} Tasks Completed ({Math.round((completedCount / (reminders.length || 1)) * 100)}%)
          </div>
        </div>

        <div className="w-48 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(completedCount / (reminders.length || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Add Reminder Form Modal / Collapse */}
      {showAddForm && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-in fade-in space-y-4">
          <h3 className="text-sm font-bold text-white">Create New Schedule Reminder</h3>

          <form onSubmit={handleAdd} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Morning Water Check, Metformin 500mg, HbA1c Test..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ReminderItem['type'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Medication">Medication</option>
                  <option value="Hydration">Hydration</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Lab Recheck">Lab Recheck</option>
                  <option value="Doctor Appointment">Doctor Appointment</option>
                  <option value="Sleep">Sleep</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-400 block mb-1">Time / Target</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 08:00 AM or Sep 15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-400 block mb-1">Frequency</label>
                <input
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="e.g. Daily with meals, Weekly"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-400 block mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Take with food to avoid stomach upset"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-md"
              >
                Save Reminder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.map((rem) => {
          return (
            <div
              key={rem.id}
              onClick={() => onToggleReminder(rem.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                rem.completedToday
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-900 border-slate-800 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleReminder(rem.id);
                  }}
                  className="shrink-0 text-amber-400"
                >
                  {rem.completedToday ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-amber-400" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-sm ${rem.completedToday ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {rem.title}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded font-medium">
                      {rem.type}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    🕒 {rem.time} • {rem.frequency}
                  </div>

                  {rem.notes && <div className="text-[11px] text-slate-500">{rem.notes}</div>}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveReminder(rem.id);
                }}
                className="text-slate-600 hover:text-rose-400 p-1.5 rounded hover:bg-slate-800"
                title="Delete Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
