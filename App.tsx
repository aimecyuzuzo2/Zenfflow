
import React, { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import RoutineList from './components/RoutineList';
import Timetable from './components/Timetable';
import EventList from './components/EventList';
import AICoach from './components/AICoach';
import { Routine, Event, AppView } from './types';

const STORAGE_KEY_ROUTINES = 'zenflow_routines';
const STORAGE_KEY_EVENTS = 'zenflow_events';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);

  // Load Initial Data
  useEffect(() => {
    const savedRoutines = localStorage.getItem(STORAGE_KEY_ROUTINES);
    const savedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (savedRoutines) setRoutines(JSON.parse(savedRoutines));
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    // Request Notification Permissions if available
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ROUTINES, JSON.stringify(routines));
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [routines, events]);

  // Routine Handlers
  const addRoutine = (r: Omit<Routine, 'id' | 'completedDates'>) => {
    const newRoutine: Routine = {
      ...r,
      id: Math.random().toString(36).substr(2, 9),
      completedDates: []
    };
    setRoutines(prev => [...prev, newRoutine]);
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

  // Event Handlers
  const addEvent = (e: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...e,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Notification Logic
  const checkNotifications = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Check routines
    routines.forEach(r => {
      const [h, m] = r.time.split(':').map(Number);
      const routineMinutes = h * 60 + m;
      const diff = routineMinutes - currentMinutes;
      
      if (diff === r.notifyBefore) {
        triggerNotification(`Upcoming Routine: ${r.title} starts in ${r.notifyBefore} minutes.`);
      }
    });

    // Check events
    events.forEach(e => {
      if (e.date === today) {
        const [h, m] = e.startTime.split(':').map(Number);
        const eventMinutes = h * 60 + m;
        const diff = eventMinutes - currentMinutes;

        if (diff === e.notifyBefore) {
          triggerNotification(`Upcoming Event: ${e.title} starts in ${e.notifyBefore} minutes.`);
        }
      }
    });
  }, [routines, events]);

  const triggerNotification = (message: string) => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, message }]);
    
    // System Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ZenFlow Alert', { body: message });
    }

    // Auto clear after 10s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  };

  // Cron-like check every minute
  useEffect(() => {
    const timer = setInterval(checkNotifications, 60000);
    return () => clearInterval(timer);
  }, [checkNotifications]);

  const renderView = () => {
    switch(view) {
      case 'dashboard': return <Dashboard routines={routines} events={events} />;
      case 'routines': return <RoutineList routines={routines} addRoutine={addRoutine} deleteRoutine={deleteRoutine} toggleRoutine={toggleRoutine} />;
      case 'timetable': return <Timetable routines={routines} events={events} />;
      case 'events': return <EventList events={events} addEvent={addEvent} deleteEvent={deleteEvent} />;
      case 'ai': return <AICoach routines={routines} events={events} />;
      default: return <Dashboard routines={routines} events={events} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 bg-slate-50 p-8 lg:p-12 relative overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>

        {/* In-app Notification Stack */}
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
          {notifications.map(n => (
            <div 
              key={n.id} 
              className="pointer-events-auto bg-white border-l-4 border-indigo-500 shadow-2xl p-4 rounded-xl flex items-start gap-3 animate-in slide-in-from-right duration-300"
            >
              <div className="bg-indigo-50 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Reminder</p>
                <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}
                className="ml-auto text-slate-300 hover:text-slate-500"
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
