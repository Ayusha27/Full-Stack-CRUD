import React, { useEffect, useState } from 'react';
import AdmissionForm from './components/AdmissionForm';
import StudentSearch from './components/StudentSearch';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { Program } from './types';


const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Fetch programs ONCE at the parent level
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get<Program[]>(`${API_BASE_URL}/programs`);
        setPrograms(res.data);
      } catch (err) {
        console.error("Error fetching programs", err);
      }
    };
    fetchPrograms();
  }, []);

  const handleSuccess = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              Admit<span className="text-blue-600">Pro</span>
            </h1>
          </div>
          <div className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Institutional Management System 2026
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
              <AdmissionForm programs={programs} onSuccess={handleSuccess} />
            </section>
            
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
              <StudentSearch />
            </section>
          </div>

          <div className="lg:col-span-4">
            <aside className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <Dashboard programs={programs} refreshKey={refreshKey} />
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* 2. Add the Chat Component here */}
      {/* This ensures it floats on top of all other content */}
      <Chat />
    </div>
  );
}

export default App;
