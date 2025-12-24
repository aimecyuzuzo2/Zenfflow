
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, MapPin, Bell } from 'lucide-react';
import { Event } from '../types';

interface EventListProps {
  events: Event[];
  addEvent: (e: Omit<Event, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, addEvent, deleteEvent }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '13:00',
    description: '',
    notifyBefore: 15
  });

  const handleAdd = () => {
    if (!formData.title) return;
    addEvent(formData);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '12:00',
      endTime: '13:00',
      description: '',
      notifyBefore: 15
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Events</h2>
          <p className="text-slate-500">Keep track of meetings, appointments, and one-offs.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {showAdd && (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-xl space-y-4 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Event Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Date</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Start Time</label>
              <input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">End Time</label>
              <input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Description / Note</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none h-20"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-slate-500 font-medium">Cancel</button>
            <button onClick={handleAdd} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-emerald-200 transition-all">Create Event</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Your calendar is currently empty.</p>
          </div>
        ) : (
          events.sort((a, b) => a.date.localeCompare(b.date)).map((event) => (
            <div 
              key={event.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group relative"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    <span className="text-lg font-bold leading-tight">{new Date(event.date).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Plus className="w-3 h-3 rotate-45" />
                        {event.startTime} - {event.endTime}
                      </span>
                      {event.description && (
                        <span className="flex items-center gap-1 italic">
                          "{event.description}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600">{event.notifyBefore}m before</span>
                  </div>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
