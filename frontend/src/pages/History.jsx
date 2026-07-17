import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Search, Calendar, Clock, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import * as api from '../services/api';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const loadHistory = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRevert = async (id, currentlyTaken) => {
    const newStatusStr = currentlyTaken ? 'Pending' : 'Taken';
    
    // Optimistic Update
    setHistory(prev => prev.map(rec => rec.id === id ? { ...rec, taken: !currentlyTaken } : rec));
    
    try {
      await api.updateMedicineStatus(id, newStatusStr);
    } catch (error) {
      console.error("Error reverting status:", error);
      loadHistory(); // rollback
    }
  };

  const filteredHistory = history.filter(record => {
    const matchesDate = record.date === formatDate(currentDate);
    const statusText = record.taken ? 'Taken' : 'Pending';
    const name = record.medicineName || record.name;
    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      statusText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-10 pb-24 md:pb-6 pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 sm:gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Activity Log</h1>
          <p className="text-lg sm:text-xl text-slate-500 mt-2 sm:mt-3 font-medium">Track your medication habits and history.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full xl:w-auto">
          <div className="flex items-center justify-between gap-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-2xl p-2 shadow-sm w-full sm:w-auto">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex items-center gap-2 font-bold text-slate-700 text-sm sm:text-base px-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
              {formatDate(currentDate)}
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all text-base sm:text-lg font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-medium text-amber-800">
          {error}
        </div>
      )}

      <div className="glass-card rounded-3xl sm:rounded-[2rem] overflow-hidden">
        
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Loading history from Node.js backend...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="p-16 text-center text-slate-500 font-medium text-lg flex flex-col items-center gap-4">
            <Calendar className="w-12 h-12 text-slate-300" />
            No history records found for {formatDate(currentDate)}.
          </div>
        ) : (
          <>
            <div className="md:hidden divide-y divide-slate-100/80 bg-white/30">
              {filteredHistory.map((record) => (
                <div key={record.id} className="p-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xl font-bold text-slate-900">{record.medicineName || record.name}</span>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                        record.taken ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {record.taken ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {record.taken ? 'Taken' : 'Pending'}
                      </span>
                      <button onClick={() => handleRevert(record.id, record.taken)} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-slate-800">
                        <RotateCcw className="w-3 h-3" /> Revert
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {record.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b-2 border-slate-200">
                    <th className="p-6 lg:p-8 text-base lg:text-lg font-bold text-slate-500 uppercase tracking-wider">Medicine</th>
                    <th className="p-6 lg:p-8 text-base lg:text-lg font-bold text-slate-500 uppercase tracking-wider">Time</th>
                    <th className="p-6 lg:p-8 text-base lg:text-lg font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 bg-white/30">
                  {filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-white/80 transition-colors group">
                      <td className="p-6 lg:p-8">
                        <span className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{record.medicineName || record.name}</span>
                      </td>
                      <td className="p-6 lg:p-8">
                        <div className="flex items-center gap-2 lg:gap-3 text-slate-600 text-base lg:text-lg font-semibold">
                          <div className="bg-slate-100 p-2 rounded-lg text-slate-400"><Clock className="w-4 h-4 lg:w-5 lg:h-5" /></div>
                          {record.time}
                        </div>
                      </td>
                      <td className="p-6 lg:p-8">
                        <div className="flex items-center justify-end gap-3">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-base lg:text-lg font-bold ${
                            record.taken ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {record.taken ? <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6" /> : <Clock className="w-5 h-5 lg:w-6 lg:h-6" />}
                            {record.taken ? 'Taken' : 'Pending'}
                          </span>
                          <button 
                            onClick={() => handleRevert(record.id, record.taken)} 
                            title="Revert Status"
                            className="p-3 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                            <RotateCcw className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
