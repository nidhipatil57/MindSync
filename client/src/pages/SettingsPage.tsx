import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Smartphone, Database, Layout, Languages 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'future'>('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Nidhi');
  const [theme, setTheme] = useState('light-calm');
  const [notifications, setNotifications] = useState(true);
  const [aiVoice, setAiVoice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✓ Local settings saved successfully.");
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Settings & Integrations</h2>
        <p className="text-slate-500 text-sm mt-1">Configure profile details, AI preferences, and review future-ready smart integrations.</p>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'profile' ? 'border-accent-lavender text-accent-lavender font-bold' : 'border-transparent text-slate-400'}`}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('future')}
          className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'future' ? 'border-accent-lavender text-accent-lavender font-bold' : 'border-transparent text-slate-400'}`}
        >
          Future-Ready Modules
        </button>
      </div>

      {/* Panel contents */}
      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings form */}
          <form onSubmit={handleSave} className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white shadow-xs text-left space-y-6">
            
            {/* User credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Display Name</label>
                <input 
                  type="text" value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Email Address</label>
                <input 
                  type="email" value={user?.email || 'demo@mindsync.com'} disabled
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* UI Theme Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">UI Theme Aesthetic</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button" onClick={() => setTheme('light-calm')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${theme === 'light-calm' ? 'border-accent-lavender bg-accent-lavender/5 text-accent-lavender' : 'border-slate-200 bg-white'}`}
                >
                  <span className="text-xs font-bold">Light Calm</span>
                  <span className="text-[10px] text-slate-400">Pastel blue & pink gradients</span>
                </button>

                <button
                  type="button" onClick={() => setTheme('dark-sanctuary')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${theme === 'dark-sanctuary' ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white'}`}
                >
                  <span className="text-xs font-bold">Dark Sanctuary (Beta)</span>
                  <span className="text-[10px] text-slate-400">Deep midnight ambient panels</span>
                </button>
              </div>
            </div>

            {/* Toggle options */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Encouraging Soft Notifications</h4>
                  <p className="text-[10px] text-slate-400">Hydration, stretching, and breathing reminders.</p>
                </div>
                <input 
                  type="checkbox" checked={notifications}
                  onChange={e => setNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-accent-sky focus:ring-accent-sky"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">AI Voice Synthesis (Streaming)</h4>
                  <p className="text-[10px] text-slate-400">Listen to AI responses using calm neural voices.</p>
                </div>
                <input 
                  type="checkbox" checked={aiVoice}
                  onChange={e => setAiVoice(e.target.checked)}
                  className="w-4 h-4 rounded text-accent-sky focus:ring-accent-sky"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
            >
              Save Configuration Settings
            </button>
          </form>
          
          <div className="bg-white/60 p-6 rounded-3xl border border-white text-xs text-slate-500 leading-relaxed text-left space-y-4 self-start">
            <h4 className="font-bold text-slate-800 flex items-center space-x-2">
              <Shield className="text-accent-lavender" size={16} />
              <span>Privacy Sandbox</span>
            </h4>
            <p>
              Your wellness logs are protected by client-side sandbox boundaries. No raw logs are analyzed outside of the secure context.
            </p>
            <button className="text-xs text-accent-lavender font-semibold hover:underline">
              Export My Wellness Data (JSON)
            </button>
          </div>
        </div>
      ) : (
        /* Future-Ready sections */
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          
          <div className="bg-white/50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between h-48 opacity-75">
            <div>
              <Smartphone size={20} className="text-slate-400 mb-4" />
              <h4 className="text-xs font-bold text-slate-800">Smartwatch / Apple Health</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                Sync heart-rate variability (HRV) and sleeping steps directly to automatically trigger stress alerts.
              </p>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold self-start uppercase">Coming Soon</span>
          </div>

          <div className="bg-white/50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between h-48 opacity-75">
            <div>
              <Database size={20} className="text-slate-400 mb-4" />
              <h4 className="text-xs font-bold text-slate-800">Therapist Portal Sync</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                Securely stream summaries and trigger patterns directly to your clinical counselor dashboard.
              </p>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold self-start uppercase">Integrations Sandbox</span>
          </div>

          <div className="bg-white/50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between h-48 opacity-75">
            <div>
              <Layout size={20} className="text-slate-400 mb-4" />
              <h4 className="text-xs font-bold text-slate-800">University & Corporate dashboard</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                Enable school and workplace wellbeing insights while preserving individual user privacy.
              </p>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold self-start uppercase">Beta Release</span>
          </div>

          <div className="bg-white/50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between h-48 opacity-75">
            <div>
              <Languages size={20} className="text-slate-400 mb-4" />
              <h4 className="text-xs font-bold text-slate-800">Multilingual AI Coach</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-2">
                Converse, dictate, and reflect in over 15 native regional languages.
              </p>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold self-start uppercase">Planned Q4</span>
          </div>

        </section>
      )}
    </div>
  );
};
