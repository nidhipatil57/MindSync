import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sparkles, Download } from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface InsightsData {
  productivityRate: number;
  averageSleep: number;
  moodBreakdown: { name: string; value: number }[];
  stressEnergyTrends: { date: string; stress: number; energy: number; productivity: number }[];
  habitStats: { name: string; streak: number; completionRate: number }[];
  aiWeeklyReport: string;
}

export const InsightsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'mood' | 'productivity'>('overview');
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/insights');
      setData(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDownloadReport = () => {
    alert("📥 Generating PDF Report Draft...\nWeekly Wellness Summary downloaded successfully (mocked).");
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-slate-400">Compiling unified wellness insights...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Insights & Analytics</h2>
          <p className="text-slate-500 text-sm mt-1">AI wellness analysis correlating physical activity, sleep cycles, and focus rates.</p>
        </div>

        <button 
          onClick={handleDownloadReport}
          className="px-5 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl flex items-center space-x-2 hover:bg-slate-800 transition-all self-start md:self-center shadow-xs"
        >
          <Download size={14} />
          <span>Export Weekly Report</span>
        </button>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/60 pb-1">
        {(['overview', 'mood', 'productivity'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-6 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all capitalize
              ${activeTab === tab 
                ? 'border-accent-lavender text-accent-lavender font-bold' 
                : 'border-transparent text-slate-400 hover:text-slate-600'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* AI Weekly Report Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-accent-sky/5 via-accent-lavender/5 to-accent-peach/5 p-6 rounded-3xl border border-white shadow-xs text-left space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Sparkles className="text-accent-lavender" size={16} />
              <span>AI Core Assessment</span>
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-white/70 p-4 rounded-2xl border border-slate-100/50">
              {data.aiWeeklyReport}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-4">
            <div className="bg-white/70 p-6 rounded-3xl border border-white shadow-xs text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Sleep duration</span>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{data.averageSleep} hrs</h3>
              <p className="text-[10px] text-slate-500 mt-2">Recommended target: 8.0 hrs</p>
            </div>

            <div className="bg-white/70 p-6 rounded-3xl border border-white shadow-xs text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Productivity completion</span>
              <h3 className="text-3xl font-extrabold text-accent-sky mt-2">{data.productivityRate}%</h3>
              <p className="text-[10px] text-slate-500 mt-2">Task resolution rate this week</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mood' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-center">
            <h3 className="text-sm font-bold text-slate-800 mb-4 text-left">Mood Index Analysis</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.moodBreakdown}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="name" stroke="#94A3B8" fontSize={10} />
                  <PolarRadiusAxis stroke="#94A3B8" fontSize={9} />
                  <Radar name="Mood Distribution" dataKey="value" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stress line trends */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Daily Stress / Energy Trends</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.stressEnergyTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none' }} />
                  <Area type="monotone" dataKey="stress" stroke="#F87171" fill="#F87171" fillOpacity={0.05} name="Stress Level" />
                  <Area type="monotone" dataKey="energy" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.05} name="Energy Level" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'productivity' && (
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-sm font-bold text-slate-800 mb-6">Habit Consistency Milestones</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.habitStats.map((h, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-800">{h.name}</h4>
                  <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full">
                    {h.streak}d streak
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span>Weekly completion Rate</span>
                  <span>{h.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent-sky h-full rounded-full" style={{ width: `${h.completionRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
