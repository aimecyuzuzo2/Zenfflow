
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Bell, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import { Event } from '../types';

interface EventListProps {
  events: Event[];
  addEvent: (e: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  editId?: string;
  onEditHandled?: () => void;
}

const NOTIFY_PRESETS = [0, 5, 10, 15, 30, 60];

const EventList: React.FC<EventListProps> = ({ 
  events, 
  addEvent, 
  updateEvent, 
  deleteEvent,
  editId,
  onEditHandled
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '13:00',
    description: '',
    notifyBefore: 15
  });

  useEffect(() => {
    if (editId) {
      const event = events.find(e => e.id === editId);
      if (event) {
        startEdit(event);
      }
    }
  }, [editId, events]);

  const startEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description || '',
      notifyBefore: event.notifyBefore
    });
    setEditingEventId(event.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.title) return;
    if (editingEventId) {
      updateEvent(editingEventId, formData);
    } else {
      addEvent(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '12:00',
      endTime: '13:00',
      description: '',
      notifyBefore: 15
    });
    setEditingEventId(null);
    setShowForm(false);
    onEditHandled?.();
  };

  const QuickNotifyEdit = ({ event }: { event: Event }) => {
    const handleStep = (step: number) => {
      const newVal = Math.max(0, (event.notifyBefore || 0) + step);
      updateEvent(event.id, { notifyBefore: newVal });
    };

    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 group/notify relative transition-colors">
        <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover/notify:text-emerald-500 transition-colors" />
        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[24px] text-center">
          {event.notifyBefore}m
        </span>
        <div className="flex flex-col opacity-0 group-hover/notify:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); handleStep(1); }} className="hover:text-emerald-600 dark:hover:text-emerald-400">
            <ChevronUp className="w-3 h-3" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleStep(-1); }} className="hover:text-emerald-600 dark:hover:text-emerald-400">
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Events</h2>
          <p className="text-slate-500 dark:text-slate-400">Keep track of meetings, appointments, and one-offs.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-emerald-100 dark:border-emerald-900/30 shadow-xl space-y-4 animate-in slide-in-from-top duration-300 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Event Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">End Time</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description / Note</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-20 resize-none dark:text-white"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notify Before</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {NOTIFY_PRESETS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({...formData, notifyBefore: m})}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${formData.notifyBefore === m ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                value={formData.notifyBefore}
                onChange={(e) => setFormData({...formData, notifyBefore: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={resetForm} className="px-4 py-2 text-slate-500 dark:text-slate-400 font-medium">Cancel</button>
            <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-emerald-200 transition-all">
              {editingEventId ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Your calendar is currently empty.</p>
          </div>
        ) : (
          events.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
            <div 
              key={event.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-tight">{new Date(event.date).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{event.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plus className="w-3 h-3 rotate-45" />
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <QuickNotifyEdit event={event} />
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => startEdit(event)}
                      className="p-2 text-slate-300 dark:text-slate-500 hover:text-emerald-600 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-slate-300 dark:text-slate-500 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {event.description && (
                <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 pl-16 italic">
                  "{event.description}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
