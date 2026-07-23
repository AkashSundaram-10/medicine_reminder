import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Lightbulb, AlertTriangle, TrendingUp, Target, Sparkles, Calendar as CalendarIcon, CheckCircle2, XCircle, AlertCircle, Activity, BrainCircuit } from 'lucide-react';
import * as api from '../services/api';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await api.getInsights();
        setInsights(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadInsights();
  }, []);

  const pieData = insights ? [
    { name: 'Taken', value: insights.adherence, color: '#3b82f6' },
    { name: 'Missed', value: 100 - insights.adherence, color: '#e2e8f0' },
  ] : [];

  const calendarData = insights?.calendarData || [];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8 sm:space-y-10 pb-24 md:pb-6 pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Health Insights</h1>
          <p className="text-lg sm:text-xl text-slate-500 mt-2 sm:mt-3 font-medium">Deep analysis of your medication routines.</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-3 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 sm:gap-3 animate-pulse">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
          Live Data Active
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-medium text-amber-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-medium">Analyzing health data...</div>
      ) : insights && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1 glass-card p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700"></div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 self-start w-full text-left flex items-center gap-2">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" /> Adherence Score
              </h2>
              
              <div className="h-48 sm:h-64 w-full relative drop-shadow-xl">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col mt-2">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700">
                    {insights.adherence}%
                  </span>
                  <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-bold mt-1">
                    {insights.adherence > 80 ? 'Excellent' : insights.adherence > 50 ? 'Fair' : 'Poor'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="glass-card p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] interactive-btn group border-t-4 border-amber-400">
                <div className="bg-amber-100/50 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 text-amber-600 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-slate-500 text-base sm:text-lg font-bold uppercase tracking-wider">Most Missed</h3>
                <p className="text-3xl sm:text-4xl font-black text-slate-900 mt-1 sm:mt-2">
                  {insights.mostMissedTime === 'N/A' ? 'None' : insights.mostMissedTime}
                </p>
              </div>

              <div className="glass-card p-6 sm:p-8 rounded-3xl sm:rounded-[2.5rem] interactive-btn group border-t-4 border-emerald-400">
                <div className="bg-emerald-100/50 w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-slate-500 text-base sm:text-lg font-bold uppercase tracking-wider">Total Missed</h3>
                <p className="text-3xl sm:text-4xl font-black text-emerald-600 mt-1 sm:mt-2">{insights.missedCount} <span className="text-xl sm:text-2xl text-slate-900 font-bold">Doses</span></p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <CalendarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" /> Past 35 Days Adherence
              </h2>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Perfect</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Partial</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Missed</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-200"></div> None Scheduled</div>
              </div>
            </div>

            <div className="overflow-x-auto pb-4 no-scrollbar">
              <div className="min-w-[500px]">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2 sm:mb-4">
                  {weekDays.map((day, i) => (
                    <div key={i} className="text-center text-slate-400 font-bold text-sm uppercase tracking-wider">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2 sm:gap-4">
                  {/* Empty leading days based on the first day in calendar data to align correctly */}
                  {calendarData.length > 0 && Array.from({ length: new Date(calendarData[0].dateStr).getDay() }).map((_, i) => (
                    <div key={`empty-lead-${i}`} className="w-full aspect-square rounded-xl sm:rounded-2xl bg-slate-50/30 border border-slate-100 border-dashed"></div>
                  ))}
                  
                  {calendarData.map((cell, i) => (
                    <div key={i} className="aspect-square relative group">
                      <div className={`w-full h-full rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl hover:z-10 border-2
                        ${cell.status === 'perfect' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-emerald-500/20' : 
                          cell.status === 'partial' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300 shadow-amber-500/20' : 
                          cell.status === 'missed' ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:border-rose-300 shadow-rose-500/20' : 
                          'bg-slate-50 text-slate-400 border-transparent hover:border-slate-300'}
                      `}>
                        <span className={`text-[10px] sm:text-xs uppercase font-bold tracking-widest leading-none mb-1 ${cell.status === 'empty' ? 'opacity-40' : 'opacity-80'}`}>
                          {new Date(cell.dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className={`text-xl sm:text-3xl font-black leading-none ${cell.status === 'empty' ? 'opacity-40' : ''}`}>
                          {cell.day}
                        </span>
                        
                        {/* Custom Tooltip */}
                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-3 bg-slate-900 text-white text-xs px-4 py-2 rounded-xl whitespace-nowrap pointer-events-none z-20 shadow-xl border border-slate-700 flex flex-col items-center gap-1">
                          <span className="font-bold text-slate-300">
                            {new Date(cell.dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <span className="font-medium text-[10px] uppercase tracking-wider text-slate-400">
                            {cell.status === 'perfect' ? '100% Taken' : 
                             cell.status === 'partial' ? 'Partially Missed' : 
                             cell.status === 'missed' ? 'All Missed' : 'No Medicine Scheduled'}
                          </span>
                          {/* Triangle pointer */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                        </div>

                        <div className="absolute bottom-1 sm:bottom-2">
                          {cell.status === 'perfect' && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 fill-emerald-100 drop-shadow-sm" />}
                          {cell.status === 'partial' && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-100 drop-shadow-sm" />}
                          {cell.status === 'missed' && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-100 drop-shadow-sm" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {/* Background design */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <BrainCircuit className="w-7 h-7 text-indigo-400" /> Deep Health Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-500/20 p-2.5 rounded-xl text-indigo-400"><Activity className="w-5 h-5" /></div>
                  <h3 className="text-indigo-200 font-bold text-sm uppercase tracking-widest">Adherence Pattern</h3>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed font-medium">
                  {insights.pattern}
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400"><AlertTriangle className="w-5 h-5" /></div>
                  <h3 className="text-amber-200 font-bold text-sm uppercase tracking-widest">Risk Level</h3>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className={`text-4xl font-black ${insights.riskLevel === 'High' ? 'text-rose-500' : insights.riskLevel === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {insights.riskLevel}
                  </span>
                  <span className="text-slate-400 font-medium">Risk of Non-Compliance</span>
                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md border border-indigo-500/20 p-6 sm:p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-500/20 p-2.5 rounded-xl text-yellow-400"><Lightbulb className="w-5 h-5" /></div>
                  <h3 className="text-yellow-200 font-bold text-sm uppercase tracking-widest">Primary Recommendation</h3>
                </div>
                <p className="text-xl sm:text-2xl text-white font-medium leading-snug">
                  "{insights.recommendation}"
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
