import { Link, useLocation } from 'react-router-dom';
import { Home, Pill, History, LineChart, Bell, Settings } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" /> },
    { name: 'Medicines', path: '/medicines', icon: <Pill className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" /> },
    { name: 'History', path: '/history', icon: <History className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" /> },
    { name: 'Insights', path: '/insights', icon: <LineChart className="w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" /> },
  ];

  return (
    <>
      {/* Top Header - Visible on all screens, but nav items only on md+ */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex h-20 md:h-24 items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 sm:p-3 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300">
                <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 block leading-tight">
                  SmartMed
                </span>
                <span className="text-xs sm:text-sm font-medium text-blue-600 hidden xs:block">Reminder System</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/50 p-1.5 lg:p-2 rounded-2xl border border-slate-200/50">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 lg:gap-3 px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl text-sm lg:text-lg font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-md shadow-slate-200 scale-105'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <span className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions & Profile */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => alert("Notifications panel would open here.")}
                className="p-2 sm:p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 shadow-sm relative"
              >
                <div className="absolute top-2 right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-rose-500 rounded-full animate-pulse"></div>
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button 
                onClick={() => alert("Application settings opened.")}
                className="hidden sm:block p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 shadow-sm"
              >
                <Settings className="w-6 h-6" />
              </button>
              <div 
                onClick={() => alert("User profile menu opened.")}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform shrink-0"
              >
                <img src="https://ui-avatars.com/api/?name=Akash+Sundaram&background=3b82f6&color=fff" alt="User Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200 pb-safe pt-2 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center gap-1 w-16"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-2' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-bold transition-all duration-300 ${
                  isActive ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-70'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
