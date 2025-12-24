
import React, { useState } from 'react';
import { Routine, Event } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  routines: Routine[];
  events: Event[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ routines, events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    if (nextDate.getFullYear() <= 2030) {
      setCurrentDate(nextDate);
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const firstDay = startDayOfMonth(year, month);
  const today = new Date().toISOString().split('T')[0];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 2030 - 2020 + 1 }, (_, i) => 2020 + i);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  const getItemsForDay = (day: number) => {
    const dateObj = new Date(year, month, day);
    const dateStr = dateObj.toISOString().split('T')[0];
    const dayOfWeek = dateObj.getDay();

    const dayEvents = events.filter(e => e.date === dateStr);
    
    const dayRoutines = routines.filter(r => {
      if (r.frequency === 'daily') return true;
      if (r.frequency === 'weekdays' && dayOfWeek >= 1 && dayOfWeek <= 5) return true;
      if (r.frequency === 'weekly' && dayOfWeek === 1) return true;
      return false;
    });

    return { events: dayEvents, routines: dayRoutines };
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule overview up to 2030.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <select 
              value={month} 
              onChange={handleMonthChange}
              className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer px-2 py-1"
            >
              {monthNames.map((name, idx) => (
                <option key={name} value={idx} className="dark:bg-slate-800">{name}</option>
              ))}
            </select>
            <div className="w-px bg-slate-100 dark:bg-slate-700 mx-1"></div>
            <select 
              value={year} 
              onChange={handleYearChange}
              className="bg-transparent border-none text-sm font-semibold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer px-2 py-1"
            >
              {years.map(y => (
                <option key={y} value={y} className="dark:bg-slate-800">{y}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
              onClick={prevMonth} 
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="px-3 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors uppercase tracking-wider"
            >
              Today
            </button>
            <button 
              onClick={nextMonth} 
              className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-30"
              disabled={year >= 2030 && month >= 11}
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
          {dayLabels.map(label => (
            <div key={label} className="py-3 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-700 border-l border-t border-transparent">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-24 md:h-36 bg-slate-50/20 dark:bg-slate-900/5" />;
            }

            const { events: dayEvents, routines: dayRoutines } = getItemsForDay(day);
            const dateStr = new Date(year, month, day).toISOString().split('T')[0];
            const isToday = dateStr === today;

            return (
              <div key={day} className={`h-24 md:h-36 p-2 relative flex flex-col gap-1 overflow-hidden transition-colors group ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>
                    {day}
                  </span>
                </div>
                
                <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide pb-1">
                  {dayRoutines.map(r => (
                    <div 
                      key={r.id} 
                      className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-semibold"
                      style={{ 
                        backgroundColor: `${r.color}15`, 
                        color: r.color || '#4f46e5',
                        borderLeft: `2px solid ${r.color || '#4f46e5'}`
                      }}
                      title={`${r.time} - ${r.title}`}
                    >
                      {r.title}
                    </div>
                  ))}
                  {dayEvents.map(e => (
                    <div 
                      key={e.id} 
                      className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500"
                      title={`${e.startTime} - ${e.title}`}
                    >
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
