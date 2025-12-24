
import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoutineList from './components/RoutineList';
import Timetable from './components/Timetable';
import EventList from './components/EventList';
import Settings from './components/Settings';
import CalendarView from './components/CalendarView';
import AICoach from './components/AICoach';
import { Routine, Event, AppView } from './types';

const STORAGE_KEY_ROUTINES = 'zenflow_routines';
const STORAGE_KEY_EVENTS = 'zenflow_events';
const STORAGE_KEY_THEME = 'zenflow_theme';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ROUTINES);
    return saved ? JSON.parse(saved) : [];
  });
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);
  const [editTarget, setEditTarget] = useState<{ type: 'routine' | 'event', id: string } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_KEY_THEME) as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(routines));
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [routines, events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addRoutine = (r: Omit<Routine, 'id' | 'completedDates'>) => {
    const newRoutine: Routine = {
      ...r,
      id: Math.random().toString(36).substr(2, 9),
      completedDates: [],
      color: r.color || '#4f46e5'
    };
    setRoutines(prev => [...prev, newRoutine]);
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const toggleRoutine = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setRoutines(prev => prev.map(r => {
      if (r.id === id) {
        const completed = r.completedDates.includes(today);
        return {
          ...r,
          completedDates: completed 
            ? r.completedDates.filter(d => d !== today)
            : [...r.completedDates, today]
        };
      }
      return r;
    }));
  };

  const addEvent = (e: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...e,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const triggerNotification = (message: string) => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, message }]);
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ZenFlow Alert', { body: message });
    }

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  };

  const checkAppStatus = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // 1. CLEANUP EXPIRED EVENTS
    setEvents(prev => {
      const filtered = prev.filter(e => {
        const isPastDate = e.date < today;
        const isPastTimeToday = e.date === today && e.endTime < currentTimeStr;
        return !isPastDate && !isPastTimeToday;
      });
      return filtered.length !== prev.length ? filtered : prev;
    });

    // 2. CHECK NOTIFICATIONS
    routines.forEach(r => {
      const [h, m] = r.time.split(':').map(Number);
      if (h * 60 + m - currentMinutes === r.notifyBefore) {
        triggerNotification(`Upcoming Routine: ${r.title} starts in ${r.notifyBefore} minutes.`);
      }
    });

    events.forEach(e => {
      if (e.date === today) {
        const [h, m] = e.startTime.split(':').map(Number);
        if (h * 60 + m - currentMinutes === e.notifyBefore) {
          triggerNotification(`Upcoming Event: ${e.title} starts in ${e.notifyBefore} minutes.`);
        }
      }
    });
  }, [routines, events]);

  useEffect(() => {
    const timer = setInterval(checkAppStatus, 60000);
    checkAppStatus();
    return () => clearInterval(timer);
  }, [checkAppStatus]);

  const handleEditFromTimetable = (type: 'routine' | 'event', id: string) => {
    setEditTarget({ type, id });
    setView(type === 'routine' ? 'routines' : 'events');
  };

  const renderView = () => {
    switch(view) {
      case 'dashboard': return <Dashboard routines={routines} events={events} />;
      case 'routines': 
        return (
          <RoutineList 
            routines={routines} 
            addRoutine={addRoutine} 
            updateRoutine={updateRoutine}
            deleteRoutine={deleteRoutine} 
            toggleRoutine={toggleRoutine} 
            editId={editTarget?.type === 'routine' ? editTarget.id : undefined}
            onEditHandled={() => setEditTarget(null)}
          />
        );
      case 'timetable': 
        return (
          <Timetable 
            routines={routines} 
            events={events} 
            onEdit={handleEditFromTimetable}
          />
        );
      case 'calendar':
        return <CalendarView routines={routines} events={events} />;
      case 'events': 
        return (
          <EventList 
            events={events} 
            addEvent={addEvent} 
            updateEvent={updateEvent}
            deleteEvent={deleteEvent} 
            editId={editTarget?.type === 'event' ? editTarget.id : undefined}
            onEditHandled={() => setEditTarget(null)}
          />
        );
      case 'coach':
        return <AICoach routines={routines} events={events} />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} />;
      default: return <Dashboard routines={routines} events={events} />;
    }
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar currentView={view} setView={(v) => setView(v as AppView)} />
      
      <main className="flex-1 p-8 lg:p-12 relative overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>

        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className="pointer-events-auto bg-white dark:bg-slate-800 border-l-4 border-indigo-500 shadow-2xl p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-right duration-300"
            >
              <div className="bg-indigo-50 dark:bg-indigo-900/40 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Reminder</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
                className="text-slate-300 dark:text-slate-500 hover:text-slate-500"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
