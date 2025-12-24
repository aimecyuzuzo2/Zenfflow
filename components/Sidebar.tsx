
import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  CalendarDays,
  Calendar,
  Settings,
  Sparkles
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const items = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'routines', label: 'Routines', icon: CalendarCheck },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0 flex flex-col p-6 transition-colors">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Clock className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">ZenFlow</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
