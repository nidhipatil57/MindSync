import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Moon, Plus, Music, Play, Trash2, Edit, Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';

export const SleepIntelligence: React.FC = () => {
  const { sleep, addSleep, deleteSleep, updateSleep } = useWellness();

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [duration, setDuration] = useState(7.5);
  const [quality, setQuality] = useState(80);
  const [bedtime, setBedtime] = useState('22:45');
  const [wakeTime, setWakeTime] = useState('06:15');
  const [submitting, setSubmitting] = useState(false);

  // Relax audio player states
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const tracks = [
    { title: "Deep Space Ocean Resonance", duration: "15 mins", id: "ocean" },
    { title: "Calming Firewood crackle", duration: "10 mins", id: "fire" },
    { title: "Theta Binaural Beats (4Hz)", duration: "25 mins", id: "theta" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateSleep(editingId, {
          duration,
          quality,
          bedtime,
          wakeTime
        });
        setEditingId(null);
      } else {
        await addSleep({
          duration,
          quality,
          bedtime,
          wakeTime
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInit = (log: any) => {
    setEditingId(log.id);
    setDuration(log.duration);
    setQuality(log.quality);
    setBedtime(log.bedtime);
    setWakeTime(log.wakeTime);
  };

  const togglePlay = (id: string) => {
    setPlayingTrack(prev => prev === id ? null : id);
  };

  const chartData = sleep.slice(-7).map(s => ({
    date: new Date(s.date).toLocaleDateString(undefined, { weekday: 'short' }),
    hours: s.duration,
    quality: s.quality
  }));

  const lastLog = sleep[sleep.length - 1] || { sleepDebt: 0.5, quality: 75 };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Sleep Intelligence</h2>
        <p className="text-slate-500 text-sm mt-1">Track circadian cycles, pay off sleep debt, and explore auditory wind-downs.</p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sleep Logging Form */}
        <section className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Moon size={18} className="text-accent-lavender" />
            <span>Log Night's Sleep</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Bedtime</label>
                <input 
                  type="time" value={bedtime}
                  onChange={e => setBedtime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Wake-up Time</label>
                <input 
                  type="time" value={wakeTime}
                  onChange={e => setWakeTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Duration (Hours)</span>
                <span className="text-slate-800 font-bold">{duration} hrs</span>
              </div>
              <input 
                type="range" min="4" max="12" step="0.5" value={duration}
                onChange={e => setDuration(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-lavender"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                <span>Sleep Quality</span>
                <span className="text-accent-lavender font-bold">{quality}%</span>
              </div>
              <input 
                type="range" min="10" max="100" step="5" value={quality}
                onChange={e => setQuality(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-lavender"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <Plus size={14} />
                <span>{submitting ? 'Logging...' : editingId ? 'Update Sleep Log' : 'Log Sleep Log'}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setDuration(7.5);
                    setQuality(80);
                    setBedtime('22:45');
                    setWakeTime('06:15');
                  }}
                  className="px-4 py-3.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Recharts Area sleep logs */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Circadian Averages</h3>
            <p className="text-xs text-slate-400">Hours slept in the last 7 nights</p>
          </div>

          <div className="h-44 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="hours" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#sleepGrad)" name="Duration (hrs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep debt metrics */}
          <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-4 text-center">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sleep Debt</span>
              <h4 className="text-base font-extrabold text-slate-800">{lastLog.sleepDebt} hrs</h4>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sleep Score</span>
              <h4 className="text-base font-extrabold text-accent-lavender">{lastLog.quality}/100</h4>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Average sleep</span>
              <h4 className="text-base font-extrabold text-slate-800">
                {sleep.length > 0 
                  ? (sleep.reduce((acc, s) => acc + s.duration, 0) / sleep.length).toFixed(1) 
                  : 7.0} hrs
              </h4>
            </div>
          </div>
        </section>

        {/* Audio Wind downs */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Wind-down Acoustics</h3>
            <p className="text-xs text-slate-400">Play calming tracks to settle your mind</p>
          </div>

          <div className="space-y-3 my-6 text-left">
            {tracks.map(track => {
              const isPlaying = playingTrack === track.id;
              return (
                <div 
                  key={track.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${isPlaying ? 'bg-accent-lavender/10 border-accent-lavender/25 text-accent-lavender' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                >
                  <div>
                    <h5 className="text-xs font-bold truncate max-w-[160px]">{track.title}</h5>
                    <span className="text-[9px] text-slate-400">{track.duration}</span>
                  </div>
                  <button 
                    onClick={() => togglePlay(track.id)}
                    className={`p-2 rounded-xl text-white shadow-xs ${isPlaying ? 'bg-accent-lavender' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {isPlaying ? <Music size={12} className="animate-bounce" /> : <Play size={12} />}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Put on headphones, dim your display, and relax.
          </p>
        </section>

      </div>

      {/* Sleep Logs Timeline */}
      <section className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/60">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
          <Calendar size={18} className="text-accent-lavender" />
          <span>Sleep Logs History</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-1">
          {[...sleep].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
            <div 
              key={log.id} 
              className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between text-left space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🌙</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{log.duration} hrs slept</h4>
                    <span className="text-[9px] text-slate-400">
                      {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button 
                    type="button"
                    onClick={() => handleEditInit(log)}
                    className="p-1 text-slate-300 hover:text-slate-600 rounded-md hover:bg-slate-50"
                  >
                    <Edit size={11} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this sleep log?")) {
                        deleteSleep(log.id);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-accent-coral rounded-md hover:bg-slate-50"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-2 text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block">Bedtime</span>
                  <span className="font-semibold text-slate-700">{log.bedtime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Wake Time</span>
                  <span className="font-semibold text-slate-700">{log.wakeTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quality</span>
                  <span className="font-semibold text-slate-700">{log.quality}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
