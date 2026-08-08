import React, { useState } from 'react';
import { 
  Sparkles, Award, Phone 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';

export const DigitalDetox: React.FC = () => {
  // Mock screen logs
  const [pickups, setPickups] = useState(42);
  const detoxStreak = 3;
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const screenUsageData = [
    { name: 'Socials', hours: 2.5 },
    { name: 'Studies', hours: 1.8 },
    { name: 'Streaming', hours: 1.2 },
    { name: 'Coding', hours: 1.0 }
  ];

  const challenges = [
    { id: 'off_2h', title: "2-hour Screen-Free Block", desc: "Turn off phone and screen for 2 hours.", difficulty: "Easy" },
    { id: 'no_social_pm', title: "No Socials After 9 PM", desc: "Lock social networking apps after 9 PM.", difficulty: "Medium" },
    { id: 'sun_detox', title: "Sunday Afternoon Offline", desc: "Power down completely from 12 PM - 6 PM.", difficulty: "Hard" }
  ];

  const handleStartChallenge = (id: string) => {
    setActiveChallenge(prev => prev === id ? null : id);
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Digital Detox & Focus</h2>
        <p className="text-slate-500 text-sm mt-1">Audit screen time, monitor compulsive phone pickups, and clear dopamine cycles.</p>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Screen usage breakdown Recharts */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Screen Time Breakdown</h3>
            <p className="text-xs text-slate-400">Estimated category hours (Daily average)</p>
          </div>

          <div className="h-52 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screenUsageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} layout="vertical">
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none' }} />
                <Bar dataKey="hours" fill="#60A5FA" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-4">
            Total average: 6.5 hours daily
          </p>
        </section>

        {/* Pickups, streaks */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between text-left">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
              <Phone className="text-slate-700" size={18} />
              <span>Mobile Habits</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Compulsive pickups and dopamine health</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phone Pickups Today</span>
                <h4 className="text-2xl font-extrabold text-slate-800 mt-1">{pickups}</h4>
                <button 
                  onClick={() => setPickups(prev => prev + 1)}
                  className="mt-3 text-[9px] font-bold text-accent-sky bg-accent-sky/10 px-2.5 py-1 rounded-md"
                >
                  + Log Pickup
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Dopamine Detox</span>
                  <h4 className="text-2xl font-extrabold text-orange-500 mt-1">{detoxStreak}d</h4>
                </div>
                <span className="text-[9px] text-slate-400 font-semibold block mt-3">Streak Active</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent-lavender/5 border border-accent-lavender/10 rounded-2xl flex items-start space-x-2 text-xs">
            <Sparkles className="text-accent-lavender shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Reducing phone pickups by 10% today will forecast a **3% reduction** in tonight's bedtime anxiety score.
            </p>
          </div>
        </section>

        {/* Focus challenges */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
            <Award className="text-accent-lavender" size={18} />
            <span>Detox Challenges</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">Commit to limits to reset digital dependency</p>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
            {challenges.map(ch => {
              const isActive = activeChallenge === ch.id;
              return (
                <div 
                  key={ch.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${isActive ? 'bg-accent-lavender/10 border-accent-lavender/25 text-accent-lavender' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold">{ch.title}</h5>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${isActive ? 'bg-accent-lavender text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {ch.difficulty}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-1 leading-relaxed ${isActive ? 'text-accent-lavender/80' : 'text-slate-400'}`}>
                    {ch.desc}
                  </p>
                  <button 
                    onClick={() => handleStartChallenge(ch.id)}
                    className={`mt-3 py-1.5 rounded-xl text-[10px] font-bold text-white shadow-xs transition-all ${isActive ? 'bg-accent-lavender' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {isActive ? '✓ Challenge Active' : 'Start Challenge'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
