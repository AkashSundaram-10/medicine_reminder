import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Pill, ChevronRight, Activity, RotateCcw, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import * as api from '../services/api';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({ medicines: [], totalScheduled: 0, taken: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDisplayDate = (date) => {
    const today = new Date();
    const diff = Math.round((date - today) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Today's Schedule";
    if (diff === -1) return "Yesterday's Schedule";
    if (diff === 1) return "Tomorrow's Schedule";
    
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getDashboardData(formatDate(currentDate));
      setDashboardData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    setDashboardData(prev => {
      const newMedicines = prev.medicines.map(med => 
        med.id === id ? { ...med, taken: newStatus === 'Taken' } : med
      );
      const takenCount = newMedicines.filter(m => m.taken).length;
      return {
        ...prev,
        medicines: newMedicines,
        taken: takenCount,
        pending: newMedicines.length - takenCount
      };
    });

    try {
      await api.updateMedicineStatus(id, newStatus, formatDate(currentDate));
    } catch (error) {
      console.error("Failed to update status", error);
      loadData(); // Revert on failure
    }
  };

  const stats = [
    { label: 'Total Scheduled', value: dashboardData.totalScheduled.toString(), icon: <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />, bg: 'bg-blue-100', border: 'border-blue-200' },
    { label: 'Taken', value: dashboardData.taken.toString(), icon: <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />, bg: 'bg-emerald-100', border: 'border-emerald-200' },
    { label: 'Pending', value: dashboardData.pending.toString(), icon: <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600" />, bg: 'bg-rose-100', border: 'border-rose-200' },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 pb-24 md:pb-6 pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Good Morning, <br className="sm:hidden"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Akash Sundaram</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 mt-2 sm:mt-3 font-medium">Your health journey is looking great today.</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-medium text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {stats.map((stat, i) => (
          <div key={i} className={`glass-card p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] flex items-center gap-4 sm:gap-6 interactive-btn border-t-4 ${stat.border}`}>
            <div className={`${stat.bg} p-4 sm:p-5 rounded-2xl shadow-inner shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900">{stat.value}</p>
              <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-500 mt-0.5 sm:mt-1 leading-tight">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl sm:rounded-[2rem] overflow-hidden">
        
        {/* Date Navigator Header */}
        <div className="px-5 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-100 bg-white/50">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 sm:gap-3">
            <CalendarIcon className="w-6 h-6 text-indigo-500" /> 
            {getDisplayDate(currentDate)}
          </h2>
          
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-700 min-w-[120px] text-center">{formatDate(currentDate)}</span>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100/80 bg-white/30">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Loading from backend...</div>
          ) : dashboardData.medicines.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium text-lg">
              No medicines scheduled for {formatDate(currentDate)}.
            </div>
          ) : (
            dashboardData.medicines.map((med) => (
              <div key={med.id} className="p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-white/80 transition-colors duration-300 group">
                
                <div className="flex items-start sm:items-center gap-4 sm:gap-6 w-full md:w-auto">
                  <div className={`p-3 sm:p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 duration-300 shrink-0 ${med.taken ? 'bg-emerald-100 text-emerald-600' : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700'}`}>
                    <Pill className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{med.medicineName || med.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-1.5">
                      <span className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs sm:text-sm font-semibold">{med.dosage}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-8 w-full md:w-auto bg-slate-50/50 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none border-slate-100">
                  <div className="text-left md:text-right">
                    <p className="text-xl sm:text-2xl font-black text-slate-900">{med.time}</p>
                    <p className={`text-sm sm:text-base font-bold mt-0.5 sm:mt-1 ${med.taken ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {med.taken ? 'Taken' : 'Pending'}
                    </p>
                  </div>
                  
                  {med.taken ? (
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 p-2 sm:p-3 rounded-full shrink-0">
                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                      </div>
                      <button onClick={() => handleStatusChange(med.id, 'Pending')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 shadow-sm">
                        <RotateCcw className="w-4 h-4" /> Undo
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleStatusChange(med.id, 'Taken')} className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:translate-y-0 whitespace-nowrap">
                      Take Now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
