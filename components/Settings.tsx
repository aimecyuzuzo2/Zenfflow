
import React from 'react';
import { Moon, Sun, Monitor, Bell, Shield, Info } from 'lucide-react';

interface SettingsProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your preferences and workspace appearance.</p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-500" />
            Appearance
          </h3>
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                theme === 'light' 
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-amber-500">
                <Sun className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 dark:text-slate-100">Light Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Crisp and clear</p>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                theme === 'dark' 
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 shadow-md flex items-center justify-center text-indigo-400">
                <Moon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 dark:text-slate-100">Dark Mode</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Easy on the eyes</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Notifications</h4>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">System notifications are enabled to keep you on track with your routines.</p>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Push Notifications</span>
            <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Data & Privacy</h4>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Your data is stored locally in your browser and never leaves your device.</p>
          <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Export My Data
          </button>
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none">
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">About ZenFlow</h4>
            <p className="text-indigo-100 mt-2 leading-relaxed">
              Version 2.0.0. A complete tool for mindful productivity. 
              Designed for consistency, built for you.
            </p>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Settings;
