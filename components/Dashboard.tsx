
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { Routine, Event, DailyStats } from '../types';

interface DashboardProps {
  routines: Routine[];
  events: Event[];
}

const Dashboard: React.FC<DashboardProps> = ({ routines, events }) => {
  // Mock data generation for charts
  const generateStats = (): DailyStats[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const total = routines.length + (Math.random() > 0.5 ? 1 : 0);
      const completed = Math.floor(Math.random() * (total + 1));
      return {
        date: day,
        total,
        completed,
        consistency: total > 0 ? (completed / total) * 100 : 0
      };
    });
  };

  const data = generateStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Your Progress</h2>
        <p className="text-slate-500 mt-1">Visualize your consistency and task completion over time.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Task Completion</h3>
            <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md">Last 7 Days</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} name="Completed" />
                <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} name="Total Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Consistency Score</h3>
            <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">Percentage %</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="consistency" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCons)" name="Consistency %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-sm font-medium">Daily Average</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">84%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-sm font-medium">Total Routines</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">{routines.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 text-sm font-medium">Upcoming Events</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{events.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
