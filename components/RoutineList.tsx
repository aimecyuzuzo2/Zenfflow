
import React, { useState } from 'react';
import { Plus, Check, Trash2, Clock, BellRing, Calendar } from 'lucide-react';
import { Routine, Frequency } from '../types';

interface RoutineListProps {
  routines: Routine[];
  addRoutine: (r: Omit<Routine, 'id' | 'completedDates'>) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutine: (id: string) => void;
}

const RoutineList: React.FC<RoutineListProps> = ({ routines, addRoutine, deleteRoutine, toggleRoutine }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newFreq, setNewFreq] = useState<Frequency>('daily');
  const [newNotify, setNewNotify] = useState(10);

  const today = new Date().toISOString().split('T')[0];

  const handleAdd = () => {
    if (!newTitle) return;
    addRoutine({
      title: newTitle,
      time: newTime,
      frequency: newFreq,
      notifyBefore: newNotify
    });
    setNewTitle('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Routines</h2>
          <p className="text-slate-500">Master your day with consistent habits.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Routine
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-xl space-y-4 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Task Name</label>
              <input 
                type="text" 
                placeholder="e.g., Morning Run" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Daily Time</label>
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Frequency</label>
              <select 
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value as Frequency)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Notify (minutes before)</label>
              <input 
                type="number" 
                value={newNotify}
                onChange={(e) => setNewNotify(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-500 font-medium">Cancel</button>
            <button onClick={handleAdd} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-indigo-200 transition-all">Create Routine</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {routines.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No routines set up yet. Start building habits today!</p>
          </div>
        ) : (
          routines.sort((a, b) => a.time.localeCompare(b.time)).map((routine) => {
            const isCompletedToday = routine.completedDates.includes(today);
            return (
              <div 
                key={routine.id} 
                className={`group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 transition-all duration-300 ${isCompletedToday ? 'opacity-60 bg-slate-50' : 'hover:border-indigo-300 hover:shadow-md'}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleRoutine(routine.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${
                      isCompletedToday ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 hover:border-indigo-500'
                    }`}
                  >
                    {isCompletedToday && <Check className="w-5 h-5 text-white" />}
                  </button>
                  <div>
                    <h4 className={`font-semibold text-slate-800 ${isCompletedToday ? 'line-through' : ''}`}>
                      {routine.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                        <Clock className="w-3 h-3" />
                        {routine.time}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 capitalize">
                        <Calendar className="w-3 h-3" />
                        {routine.frequency}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                        <BellRing className="w-3 h-3" />
                        {routine.notifyBefore}m early
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteRoutine(routine.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RoutineList;
