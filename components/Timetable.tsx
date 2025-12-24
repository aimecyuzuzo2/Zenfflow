
import React from 'react';
import { Routine, Event } from '../types';
import { Clock, Calendar } from 'lucide-react';

interface TimetableProps {
  routines: Routine[];
  events: Event[];
}

const Timetable: React.FC<TimetableProps> = ({ routines, events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = new Date().toISOString().split('T')[0];

  // Combine routines and today's events
  const dayItems = [
    ...routines.map(r => ({ ...r, type: 'routine' as const })),
    ...events.filter(e => e.date === today).map(e => ({ ...e, type: 'event' as const, time: e.startTime }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Today's Schedule</h2>
        <p className="text-slate-500 mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Timeline Grid */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-100" />
        
        <div className="divide-y divide-slate-100">
          {hours.map((hour) => {
            const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
            const hourItems = dayItems.filter(item => {
              const [h] = item.time.split(':');
              return parseInt(h) === hour;
            });

            return (
              <div key={hour} className="flex min-h-[80px]">
                <div className="w-16 flex justify-center py-4 text-xs font-semibold text-slate-400 sticky left-0 bg-white">
                  {timeLabel}
                </div>
                <div className="flex-1 p-2 flex flex-col gap-2 relative">
                  {hourItems.map((item, idx) => (
                    <div 
                      key={`${item.id}-${idx}`}
                      className={`p-3 rounded-xl border-l-4 shadow-sm transition-transform hover:scale-[1.01] ${
                        item.type === 'routine' 
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-900' 
                          : 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{item.title}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                          {item.time}
                        </span>
                      </div>
                      {item.type === 'event' && (
                        <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          One-off Event
                        </p>
                      )}
                      {item.type === 'routine' && (
                        <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Daily Routine
                        </p>
                      )}
                    </div>
                  ))}
                  {hourItems.length === 0 && (
                    <div className="flex-1 border border-dashed border-slate-50 rounded-xl"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
