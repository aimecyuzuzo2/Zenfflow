
import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Clock, 
  Sparkles, 
  CalendarDays 
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
    { id: 'routines', label: 'Routines', icon: CalendarCheck },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'ai', label: 'AI Coach', icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">ZenFlow</h1>
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
                  ? 'bg-indigo-50 text-indigo-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="px-4 py-3 bg-slate-50 rounded-xl">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">All systems go</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
