import React, { useEffect, useState } from 'react';
import { Pill, CheckCircle, Clock, X, BellRing, ChevronRight, BrainCircuit } from 'lucide-react';
import * as api from '../services/api';

const getCurrentTimeFormatted = () => {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours.toString().padStart(2, '0');
  const strMinutes = minutes.toString().padStart(2, '0');
  return `${strHours}:${strMinutes} ${ampm}`;
};

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseTimeToDate = (timeStr) => {
  const match = (timeStr || '').match(/^(\d+):(\d+)\s+(AM|PM)$/i);
  if (!match) return new Date();
  let [_, hours, minutes, ampm] = match;
  hours = parseInt(hours, 10);
  if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  
  const d = new Date();
  d.setHours(hours, parseInt(minutes, 10), 0, 0);
  return d;
};

export default function ReminderAlert() {
  const [medicines, setMedicines] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [activeReminders, setActiveReminders] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(new Set());
  const [takingId, setTakingId] = useState(null);

  useEffect(() => {
    const fetchMedsAndWarnings = async () => {
      try {
        const dateStr = getLocalDate();
        const data = await api.getDashboardData(dateStr);
        setMedicines(data.medicines || []);
        
        try {
          const aiData = await api.getAIoTWarnings(dateStr);
          setWarnings(aiData || []);
        } catch (aiErr) {
          console.warn("AI warnings not available right now");
        }
      } catch (error) {
        console.error('Error fetching data for reminder', error);
      }
    };
    
    fetchMedsAndWarnings();
    const interval = setInterval(fetchMedsAndWarnings, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentFormatted = getCurrentTimeFormatted();
      
      const dueMeds = medicines.filter(med => {
        if (med.taken || med.skipped) return false;
        if (med.time !== currentFormatted) return false;
        if (dismissedIds.has(med.id)) return false;
        return true;
      }).map(m => ({ ...m, typeAlert: 'normal' }));

      const dueWarnings = medicines.filter(med => {
        if (med.taken || med.skipped) return false;
        const warning = warnings.find(w => w.id === med.id);
        if (!warning) return false;
        
        const warningId = `warn-${med.id}`;
        if (dismissedIds.has(warningId)) return false;
        
        const medTime = parseTimeToDate(med.time);
        const diffMinutes = Math.round((medTime - now) / 60000);
        
        // Trigger alert exactly at the warnMinutesBefore mark
        return diffMinutes === warning.warnMinutesBefore;
      }).map(m => {
        const warning = warnings.find(w => w.id === m.id);
        return { ...m, typeAlert: 'ai', reason: warning.reason, warningId: `warn-${m.id}`, warnMinutesBefore: warning.warnMinutesBefore };
      });

      const allDue = [...dueMeds, ...dueWarnings];

      if (allDue.length > 0) {
        setActiveReminders(prev => {
          const newReminders = allDue.filter(d => {
            const idToCheck = d.typeAlert === 'ai' ? d.warningId : d.id;
            return !prev.find(p => (p.typeAlert === 'ai' ? p.warningId : p.id) === idToCheck);
          });
          return [...prev, ...newReminders];
        });
      }
    };

    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [medicines, warnings, dismissedIds]);

  const handleTakeMedicine = async (med) => {
    setTakingId(med.id);
    try {
      await api.updateMedicineStatus(med.id, 'Taken', getLocalDate());
      setTimeout(() => {
        dismissReminder(med.id);
        setTakingId(null);
      }, 600);
    } catch (error) {
      console.error('Failed to mark as taken', error);
      setTakingId(null);
    }
  };

  const dismissReminder = (id) => {
    setDismissedIds(prev => new Set(prev).add(id));
    setActiveReminders(prev => prev.filter(m => (m.typeAlert === 'ai' ? m.warningId : m.id) !== id));
  };

  if (activeReminders.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md transition-all duration-500">
      <div className="flex flex-col gap-6 max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar">
        {activeReminders.map((med, index) => {
          const isAI = med.typeAlert === 'ai';
          const uId = isAI ? med.warningId : med.id;

          return (
            <div 
              key={uId} 
              className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden relative transform transition-all duration-500 animate-in zoom-in-95 fade-in slide-in-from-bottom-12"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Animated Glow Backgrounds */}
              <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl animate-pulse ${isAI ? 'bg-orange-500/20' : 'bg-indigo-500/20'}`}></div>
              <div className={`absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-3xl animate-pulse ${isAI ? 'bg-yellow-500/10' : 'bg-rose-500/10'}`} style={{ animationDelay: '1s' }}></div>
              
              <div className="p-8 sm:p-10 relative z-10">
                <button 
                  onClick={() => dismissReminder(uId)}
                  className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-all hover:rotate-90 duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center text-center mb-8 mt-2">
                  
                  {/* Pulsating Icon Wrapper */}
                  <div className="relative flex items-center justify-center mb-6">
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-20 duration-1000 ${isAI ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
                    <div className={`absolute inset-[-10px] border-2 rounded-full animate-spin-slow opacity-50 ${isAI ? 'border-orange-200' : 'border-indigo-200'}`} style={{ animationDuration: '4s' }}></div>
                    <div className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-xl transform transition-transform hover:scale-110 duration-300 ${isAI ? 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/40' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/40'}`}>
                      {isAI ? (
                        <BrainCircuit className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" style={{ animationDuration: '2s' }} />
                      ) : (
                        <BellRing className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                      )}
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 font-bold rounded-full text-sm mb-3 shadow-sm border ${isAI ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
                    <Clock className="w-4 h-4" /> 
                    {isAI ? `Approaching: ${med.time}` : `It is exactly ${med.time}`}
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight mb-2">
                    {isAI ? 'AI Early Warning' : 'Time for your'} <br/>
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isAI ? 'from-orange-600 to-amber-600' : 'from-indigo-600 to-purple-600'}`}>
                      {med.medicineName || med.name}
                    </span>
                  </h2>
                  <p className={`font-medium text-lg ${isAI ? 'text-orange-600' : 'text-slate-500'}`}>
                    {isAI ? med.reason : 'Please take your prescribed dosage now.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Dosage</span>
                    <span className="text-lg font-bold text-slate-800">{med.dosage}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Type</span>
                    <span className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                      <Pill className={`w-4 h-4 ${isAI ? 'text-orange-500' : 'text-indigo-500'}`} /> {med.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => isAI ? dismissReminder(uId) : handleTakeMedicine(med)}
                    disabled={takingId === med.id}
                    className={`relative overflow-hidden w-full group text-white font-bold text-lg sm:text-xl py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-xl hover:-translate-y-1 ${
                      takingId === med.id 
                        ? 'bg-emerald-500 scale-105 shadow-emerald-500/50' 
                        : isAI 
                          ? 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-orange-500/30 hover:shadow-orange-500/50'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30 hover:shadow-indigo-500/50'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    {isAI ? (
                      <>
                        <BrainCircuit className="w-7 h-7 group-hover:scale-110 transition-transform" /> 
                        Got it, I'll prepare it!
                      </>
                    ) : takingId === med.id ? (
                      <>
                        <CheckCircle className="w-7 h-7 animate-in zoom-in duration-300" /> 
                        Confirmed!
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" /> 
                        I Took My Medicine
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => dismissReminder(uId)}
                    disabled={takingId === med.id}
                    className="w-full text-slate-500 hover:text-slate-800 font-bold py-3 text-sm sm:text-base transition-colors flex items-center justify-center gap-1"
                  >
                    {isAI ? 'Dismiss Warning' : 'Skip for now'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
