
import React from 'react';
import { Routine, Event } from '../types';
import { Clock, Calendar, Edit2 } from 'lucide-react';

interface TimetableProps {
  routines: Routine[];
  events: Event[];
  onEdit: (type: 'routine' | 'event', id: string) => void;
}

const Timetable: React.FC<TimetableProps> = ({ routines, events, onEdit }) => {
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
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Today's Schedule</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </header>

      <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors">
        {/* Timeline Grid */}
        <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-700/50" />
        
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {hours.map((hour) => {
            const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
            const hourItems = dayItems.filter(item => {
              const [h] = item.time.split(':');
              return parseInt(h) === hour;
            });

            return (
              <div key={hour} className="flex min-h-[80px]">
                <div className="w-16 flex justify-center py-4 text-xs font-semibold text-slate-400 dark:text-slate-500 sticky left-0 bg-white dark:bg-slate-800 transition-colors">
                  {timeLabel}
                </div>
                <div className="flex-1 p-2 flex flex-col gap-2 relative">
                  {hourItems.map((item, idx) => {
                    const rColor = item.type === 'routine' ? (item as Routine).color || '#4f46e5' : '#10b981';
                    
                    return (
                      <div 
                        key={`${item.id}-${idx}`}
                        className={`group p-3 rounded-2xl border-l-4 shadow-sm transition-transform hover:scale-[1.01] relative`}
                        style={{ 
                          backgroundColor: `${rColor}15`, // Slightly more visible in dark
                          borderLeftColor: rColor,
                          color: rColor === '#475569' ? (document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#1e293b') : rColor 
                        }}
                      >
                        <button 
                          onClick={() => onEdit(item.type, item.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 bg-white/80 dark:bg-slate-700/80 backdrop-blur rounded-lg transition-all hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm pr-6">{item.title}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                            {item.time}
                          </span>
                        </div>
                        
                        {(item.description || (item as any).description) && (
                          <p className="text-[11px] opacity-70 italic line-clamp-1 mt-0.5">
                            {item.description || (item as any).description}
                          </p>
                        )}

                        {item.type === 'event' && (
                          <p className="text-[10px] opacity-70 mt-1 flex items-center gap-1 font-medium">
                            <Calendar className="w-2.5 h-2.5" />
                            One-off Event
                          </p>
                        )}
                        {item.type === 'routine' && (
                          <p className="text-[10px] opacity-70 mt-1 flex items-center gap-1 font-medium">
                            <Clock className="w-2.5 h-2.5" />
                            Daily Routine
                          </p>
                        )}
                      </div>
                    );
                  })}
                  {hourItems.length === 0 && (
                    <div className="flex-1 border border-dashed border-slate-50 dark:border-slate-800/50 rounded-xl"></div>
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
