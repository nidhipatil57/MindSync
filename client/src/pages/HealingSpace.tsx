import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  HeartHandshake, Sparkles, Music, Play, 
  Pause
} from 'lucide-react';

interface HealingContent {
  affirmations: string[];
  prompts: string[];
  audio: { title: string; duration: string; url: string }[];
}

export const HealingSpace: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'anxiety' | 'loneliness' | 'breakup'>('anxiety');
  const [data, setData] = useState<HealingContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [savedLogs, setSavedLogs] = useState<string[]>([]);
  
  // Auditory track state
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);

  const fetchHealingContent = async () => {
    setLoading(true);
    try {
      const content = await api.get(`/api/healing?mode=${activeMode}`);
      setData(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealingContent();
    setPlayingTrack(null);
  }, [activeMode]);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setSavedLogs(prev => [reflectionText.trim(), ...prev]);
    setReflectionText('');
    alert("Reflection log saved locally in your healing timeline.");
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Healing Space</h2>
          <p className="text-slate-500 text-sm mt-1">A dedicated sanctuary for emotional decompression, grief counseling, and anxiety release.</p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap gap-2 self-start md:self-center">
          {(['anxiety', 'loneliness', 'breakup'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`
                px-4 py-2 text-xs font-semibold rounded-full border transition-all capitalize
                ${activeMode === mode 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}
              `}
            >
              {mode} Recovery
            </button>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Affirmations panel */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <HeartHandshake className="text-accent-coral" size={18} />
            <span>Daily Affirmations</span>
          </h3>

          <div className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-400">Loading comfort affirmations...</p>
            ) : (
              data?.affirmations.map((aff, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-gradient-to-br from-accent-sky/5 to-accent-lavender/5 border border-white rounded-2xl relative shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{aff}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Ambient Acoustics panel */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
              <Music className="text-accent-lavender" size={18} />
              <span>Ambient Sleep acoustics</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Play loop audio for grounding exercises</p>

            <div className="space-y-3">
              {loading ? (
                <p className="text-xs text-slate-400">Loading auditory tracks...</p>
              ) : (
                data?.audio.map((track, idx) => {
                  const isPlaying = playingTrack === track.url;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${isPlaying ? 'bg-accent-sky/10 border-accent-sky/25 text-accent-sky' : 'bg-slate-50 border-slate-100 text-slate-700'}`}
                    >
                      <div>
                        <h5 className="text-xs font-bold truncate max-w-[150px]">{track.title}</h5>
                        <span className="text-[9px] text-slate-400">{track.duration}</span>
                      </div>
                      <button 
                        onClick={() => setPlayingTrack(isPlaying ? null : track.url)}
                        className={`p-2 rounded-xl text-white shadow-xs ${isPlaying ? 'bg-accent-sky' : 'bg-slate-900 hover:bg-slate-800'}`}
                      >
                        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center mt-6">
            Put on headphones, close your eyes, and listen.
          </p>
        </section>

        {/* Healing Reflection journaling */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
            <Sparkles className="text-accent-sky animate-pulse" size={18} />
            <span>Healing Reflections</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">Pen down raw thoughts without formatting pressure</p>

          <form onSubmit={handleSaveReflection} className="space-y-4">
            {data && data.prompts.length > 0 && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 leading-relaxed italic">
                ✏ <strong>Suggested:</strong> {data.prompts[0]}
              </div>
            )}
            
            <textarea
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder="Reflect freely here..."
              rows={4}
              required
              className="w-full p-3.5 bg-white border border-slate-200/60 rounded-2xl text-xs focus:outline-hidden focus:border-accent-sky text-slate-700"
            />

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
            >
              Log Reflection Entry
            </button>
          </form>

          {/* Timeline reflections */}
          {savedLogs.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-4">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-3">Reflection Timeline</span>
              <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1 hide-scrollbar">
                {savedLogs.map((log, idx) => (
                  <p key={idx} className="text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 truncate">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
