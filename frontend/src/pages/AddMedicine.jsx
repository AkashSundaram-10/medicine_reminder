import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill, Clock, Calendar as CalendarIcon, Save } from 'lucide-react';
import * as api from '../services/api';

export default function AddMedicine() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    type: 'Tablet',
    date: '2026-07-16',
  });

  // Custom Time State
  const [timeHour, setTimeHour] = useState('08');
  const [timeMinute, setTimeMinute] = useState('00');
  const [timePeriod, setTimePeriod] = useState('AM');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Compile the custom time into a string
    const finalTime = `${timeHour}:${timeMinute} ${timePeriod}`;
    const payload = { ...formData, time: finalTime };

    try {
      await api.createMedicine(payload);
      alert(`Successfully scheduled ${formData.name} for ${finalTime}!`);
      navigate('/medicines');
    } catch (error) {
      console.error("Failed to save new medicine:", error);
      alert("Failed to save medicine. Please try again.");
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 pb-24 md:pb-6 pt-4 sm:pt-6 animate-in fade-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/medicines')}
          className="p-3 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl shadow-sm border border-slate-200 transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Add New Medicine</h1>
          <p className="text-slate-500 mt-1 font-medium">Create a new medication schedule.</p>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* Section 1: Medication Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Pill className="w-6 h-6 text-indigo-500" /> Medication Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Medicine Name</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Amoxicillin" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Dosage</label>
                <input 
                  required
                  type="text" 
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  placeholder="e.g. 500mg" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Type</label>
                <div className="relative">
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Drops">Drops</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Schedule Settings */}
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Clock className="w-6 h-6 text-indigo-500" /> Schedule Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Start Date
                </label>
                <input 
                  required
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700 cursor-pointer"
                />
              </div>

              {/* Custom Professional Time Picker */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Reminder Time
                </label>
                
                <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                  
                  {/* Hour Dropdown */}
                  <div className="relative flex-1">
                    <select 
                      value={timeHour} 
                      onChange={(e) => setTimeHour(e.target.value)}
                      className="w-full pl-4 pr-8 py-2 bg-transparent text-center focus:outline-none font-bold text-xl text-slate-800 appearance-none cursor-pointer"
                    >
                      {Array.from({length: 12}, (_, i) => {
                        const hr = (i + 1).toString().padStart(2, '0');
                        return <option key={hr} value={hr}>{hr}</option>;
                      })}
                    </select>
                  </div>
                  
                  <span className="text-2xl font-black text-slate-400 pb-1">:</span>
                  
                  {/* Minute Dropdown */}
                  <div className="relative flex-1">
                    <select 
                      value={timeMinute} 
                      onChange={(e) => setTimeMinute(e.target.value)}
                      className="w-full pl-4 pr-8 py-2 bg-transparent text-center focus:outline-none font-bold text-xl text-slate-800 appearance-none cursor-pointer"
                    >
                      {Array.from({length: 12}, (_, i) => {
                        const min = (i * 5).toString().padStart(2, '0'); // Increments of 5 mins
                        return <option key={min} value={min}>{min}</option>;
                      })}
                    </select>
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="flex bg-slate-200/70 rounded-xl p-1 shrink-0">
                    <button 
                      type="button"
                      onClick={() => setTimePeriod('AM')}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${timePeriod === 'AM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      AM
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTimePeriod('PM')}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${timePeriod === 'PM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1"
            >
              <Save className="w-6 h-6" />
              Save Medication
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
