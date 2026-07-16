import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import AddMedicine from './pages/AddMedicine';
import History from './pages/History';
import Insights from './pages/Insights';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicines/add" element={<AddMedicine />} />
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
