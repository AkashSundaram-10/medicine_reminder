import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Calendar, Clock, Pill } from 'lucide-react';
import * as api from '../services/api';

export default function Medicines() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMedicines = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await api.getMedicines();
      setMedicines(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this medication?")) {
      setMedicines(prev => prev.filter(m => m.id !== id));
      try {
        await api.deleteMedicine(id);
      } catch (error) {
        console.error("Failed to delete", error);
        loadMedicines();
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/medicines/${id}/edit`);
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-24 md:pb-6 pt-4 sm:pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Medicine Setup</h1>
          <p className="text-lg sm:text-xl text-slate-500 mt-2 sm:mt-3 font-medium">Manage your daily prescriptions and schedules.</p>
        </div>
        <button 
          onClick={() => navigate('/medicines/add')}
          className="flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:translate-y-0 w-full md:w-auto">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          Add New Medicine
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 font-medium text-amber-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center p-12 text-slate-500 font-medium">Loading medicines from backend...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {medicines.map((med) => (
            <div key={med.id} className="glass-card rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 interactive-btn group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/5 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-5 sm:mb-6">
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-indigo-600 shadow-inner z-10 relative">
                  <Pill className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 relative">
                  <button 
                    onClick={() => handleEdit(med.id)}
                    className="p-2.5 sm:p-3 bg-white hover:bg-indigo-50 text-indigo-600 rounded-lg sm:rounded-xl shadow-sm border border-indigo-100 transition-colors">
                    <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(med.id)}
                    className="p-2.5 sm:p-3 bg-white hover:bg-rose-50 text-rose-600 rounded-lg sm:rounded-xl shadow-sm border border-rose-100 transition-colors">
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="z-10 relative">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{med.medicineName || med.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                  <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-100 text-slate-600 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold border border-slate-200">{med.dosage}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-100/80 z-10 relative">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Date
                  </p>
                  <p className="text-base sm:text-lg font-bold text-slate-700">{med.date}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-1 flex items-center gap-1 sm:gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Time
                  </p>
                  <p className="text-lg sm:text-xl font-black text-indigo-600">{med.time}</p>
                </div>
              </div>
            </div>
          ))}

          <div 
            onClick={() => navigate('/medicines/add')}
            className="glass-card rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col items-center justify-center text-center interactive-btn border-2 border-dashed border-slate-300 hover:border-indigo-400 group cursor-pointer bg-slate-50/50 min-h-[250px] sm:min-h-[300px]">
            <div className="bg-slate-100 group-hover:bg-indigo-100 p-5 sm:p-6 rounded-full mb-3 sm:mb-4 transition-colors duration-300">
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-600 group-hover:text-indigo-700">Add Medication</h3>
            <p className="text-sm sm:text-base text-slate-400 mt-1 sm:mt-2 font-medium">Click to schedule a new pill</p>
          </div>
        </div>
      )}
    </div>
  );
}
