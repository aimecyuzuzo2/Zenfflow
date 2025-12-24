
import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { analyzeRoutine } from '../services/geminiService';
import { Routine, Event } from '../types';

interface AICoachProps {
  routines: Routine[];
  events: Event[];
}

const AICoach: React.FC<AICoachProps> = ({ routines, events }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    conflicts: string[];
    suggestions: string[];
    insight: string;
  } | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    const data = await analyzeRoutine(routines, events);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-300">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">AI Coach</h2>
          <p className="text-slate-500 mt-1">Get intelligent insights on your schedule and productivity.</p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-100 transition-all"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Analyze My Routine
        </button>
      </header>

      {!result && !loading && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="text-indigo-600 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Ready to optimize?</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Gemini will scan your routines and events to find potential gaps and suggest improvements.</p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="text-amber-500 w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-800">Productivity Suggestions</h3>
              </div>
              <ul className="space-y-4">
                {result.suggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500 w-6 h-6" />
                <h3 className="text-lg font-bold text-slate-800">Potential Conflicts</h3>
              </div>
              {result.conflicts.length > 0 ? (
                <ul className="space-y-3">
                  {result.conflicts.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-red-600 font-medium">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {c}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">No major conflicts detected. Your schedule looks balanced!</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
              <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
              <h3 className="text-xl font-bold mb-4">Zen Insight</h3>
              <p className="text-indigo-50 leading-relaxed text-lg">
                "{result.insight}"
              </p>
            </div>
            
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <h4 className="text-emerald-800 font-bold mb-2">Did you know?</h4>
              <p className="text-emerald-700 text-sm">Consistent routines can reduce decision fatigue and help you focus on high-impact work.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoach;
