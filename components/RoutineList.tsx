
import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Clock, BellRing, Calendar, Edit2, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { Routine, Frequency } from '../types';

interface RoutineListProps {
  routines: Routine[];
  addRoutine: (r: Omit<Routine, 'id' | 'completedDates'>) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutine: (id: string) => void;
  editId?: string;
  onEditHandled?: () => void;
}

const COLORS = [
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Slate', value: '#475569' },
];

const NOTIFY_PRESETS = [0, 5, 10, 15, 30, 60];

const RoutineList: React.FC<RoutineListProps> = ({ 
  routines, 
  addRoutine, 
  updateRoutine, 
  deleteRoutine, 
  toggleRoutine,
  editId,
  onEditHandled
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRoutineId, setEditingRoutineId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '08:00',
    frequency: 'daily' as Frequency,
    notifyBefore: 10,
    color: '#4f46e5'
  });

  useEffect(() => {
    if (editId) {
      const routine = routines.find(r => r.id === editId);
      if (routine) {
        startEdit(routine);
      }
    }
  }, [editId, routines]);

  const startEdit = (routine: Routine) => {
    setFormData({
      title: routine.title,
      description: routine.description || '',
      time: routine.time,
      frequency: routine.frequency,
      notifyBefore: routine.notifyBefore,
      color: routine.color || '#4f46e5'
    });
    setEditingRoutineId(routine.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title) return;
    if (editingRoutineId) {
      updateRoutine(editingRoutineId, formData);
    } else {
      addRoutine(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time: '08:00',
      frequency: 'daily',
      notifyBefore: 10,
      color: '#4f46e5'
    });
    setEditingRoutineId(null);
    setShowForm(false);
    onEditHandled?.();
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (!completedDates || completedDates.length === 0) return 0;
    const sortedDates = [...completedDates].sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const hasToday = sortedDates.includes(today);
    const hasYesterday = sortedDates.includes(yesterdayStr);
    if (!hasToday && !hasYesterday) return 0;
    let streak = 0;
    let checkDate = hasToday ? new Date(today) : new Date(yesterdayStr);
    while (true) {
      const checkStr = checkDate.toISOString().split('T')[0];
      if (completedDates.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const today = new Date().toISOString().split('T')[0];

  const QuickNotifyEdit = ({ routine }: { routine: Routine }) => {
    const handleStep = (step: number) => {
      const newVal = Math.max(0, (routine.notifyBefore || 0) + step);
      updateRoutine(routine.id, { notifyBefore: newVal });
    };

    return (
      <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 group/notify">
        <BellRing className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover/notify:text-indigo-500 transition-colors" />
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 min-w-[20px] text-center">
          {routine.notifyBefore}m
        </span>
        <div className="flex flex-col opacity-0 group-hover/notify:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); handleStep(1); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            <ChevronUp className="w-2.5 h-2.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleStep(-1); }} className="hover:text-indigo-600 dark:hover:text-indigo-400">
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Routines</h2>
          <p className="text-slate-500 dark:text-slate-400">Master your day with consistent habits and streaks.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Routine
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-indigo-100 dark:border-indigo-900/30 shadow-xl space-y-4 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Task Name</label>
              <input 
                type="text" 
                placeholder="e.g., Morning Run" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Daily Time</label>
              <input 
                type="time" 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
              <textarea 
                placeholder="Notes about this routine..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20 resize-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Frequency</label>
              <select 
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value as Frequency})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notify (minutes before)</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {NOTIFY_PRESETS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({...formData, notifyBefore: m})}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${formData.notifyBefore === m ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                value={formData.notifyBefore}
                onChange={(e) => setFormData({...formData, notifyBefore: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Routine Color</label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setFormData({...formData, color: c.value})}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c.value ? 'border-slate-800 dark:border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={resetForm} className="px-4 py-2 text-slate-500 dark:text-slate-400 font-medium">Cancel</button>
            <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-indigo-200 transition-all">
              {editingRoutineId ? 'Update Routine' : 'Create Routine'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {routines.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <Clock className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No routines set up yet. Start building habits today!</p>
          </div>
        ) : (
          routines.sort((a, b) => a.time.localeCompare(b.time)).map((routine) => {
            const isCompletedToday = routine.completedDates.includes(today);
            const streak = calculateStreak(routine.completedDates);
            const rColor = routine.color || '#4f46e5';

            return (
              <div 
                key={routine.id} 
                className={`group flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 ${isCompletedToday ? 'opacity-60 bg-slate-50 dark:bg-slate-900/50' : 'hover:shadow-md'}`}
                style={{ borderLeftColor: rColor, borderLeftWidth: '6px' }}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleRoutine(routine.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2`}
                    style={{ 
                      backgroundColor: isCompletedToday ? rColor : 'transparent',
                      borderColor: isCompletedToday ? rColor : '#e2e8f0'
                    }}
                  >
                    {isCompletedToday && <Check className="w-5 h-5 text-white" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-semibold text-slate-800 dark:text-slate-100 ${isCompletedToday ? 'line-through' : ''}`}>
                        {routine.title}
                      </h4>
                      {streak > 0 && (
                        <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold">
                          <Zap className="w-3 h-3 fill-orange-600 dark:fill-orange-400" />
                          {streak} DAY STREAK
                        </div>
                      )}
                    </div>
                    {routine.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 max-w-md line-clamp-1">{routine.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        {routine.time}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 dark:text-slate-500 capitalize">
                        <Calendar className="w-3 h-3" />
                        {routine.frequency}
                      </span>
                      <QuickNotifyEdit routine={routine} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => startEdit(routine)}
                    className="p-2 text-slate-300 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteRoutine(routine.id)}
                    className="p-2 text-slate-300 dark:text-slate-500 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoutineList;
