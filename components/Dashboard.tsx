
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { Routine, Event, DailyStats } from '../types';

interface DashboardProps {
  routines: Routine[];
  events: Event[];
}

const Dashboard: React.FC<DashboardProps> = ({ routines, events }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#94a3b8' : '#64748b';
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';

  const statsData = useMemo(() => {
    const days = [];
    const now = new Date();
    
    // Generate last 7 days including today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
      
      const totalRoutines = routines.length;
      const completedRoutines = routines.filter(r => r.completedDates.includes(isoDate)).length;
      const percentage = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0;
      
      days.push({
        date: dayName,
        total: totalRoutines,
        completed: completedRoutines,
        percentage: percentage
      });
    }
    return days;
  }, [routines]);

  const averageCompletion = useMemo(() => {
    if (statsData.length === 0) return 0;
    const sum = statsData.reduce((acc, curr) => acc + curr.percentage, 0);
    return Math.round(sum / statsData.length);
  }, [statsData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Consistency Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Graphical representation of your routine completion percentage.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Percentage Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Daily Completion %</h3>
            <span className="text-xs font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-md">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: isDarkMode ? '#334155' : '#f8fafc'}}
                  contentStyle={{backgroundColor: tooltipBg, borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: isDarkMode ? '#f8fafc' : '#1e293b'}}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                />
                <Bar dataKey="percentage" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency Trend Area Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Consistency Trend</h3>
            <span className="text-xs font-medium px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-md">Performance</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData}>
                <defs>
                  <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: textColor, fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{backgroundColor: tooltipBg, borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: isDarkMode ? '#f8fafc' : '#1e293b'}}
                  formatter={(value: number) => [`${value}%`, 'Completion']}
                />
                <Area type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPercentage)" name="Completion %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Weekly Average</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{averageCompletion}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Routines</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{routines.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center transition-colors">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Scheduled Events</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{events.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
