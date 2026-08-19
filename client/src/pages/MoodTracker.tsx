import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Plus, Sparkles, Calendar, Trash2, Edit 
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip 
} from 'recharts';

export const MoodTracker: React.FC = () => {
  const { moods, addMood, deleteMood, updateMood } = useWellness();

  // Logging Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState('Calm');
  const [intensity, setIntensity] = useState(7);
  const [stress, setStress] = useState(4);
  const [energy, setEnergy] = useState(6);
  const [notes, setNotes] = useState('');
  const [reasons, setReasons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const moodEmojis: Record<string, string> = {
    Joyful: '😊',
    Calm: '🧘',
    Focused: '🎯',
    Tired: '😴',
    Anxious: '😰',
    Stressed: '🤯',
    Sad: '😢'
  };

  const reasonTags = ['Work', 'Studies', 'Sleep', 'Friends', 'Exercise', 'Rest', 'Nature', 'Diet', 'Routine'];

  const toggleReason = (tag: string) => {
    setReasons(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateMood(editingId, {
          mood: selectedMood,
          intensity,
          stress,
          energy,
          notes,
          reasons
        });
        setEditingId(null);
      } else {
        await addMood({
          mood: selectedMood,
          intensity,
          stress,
          energy,
          notes,
          reasons
        });
      }
      // Reset
      setNotes('');
      setReasons([]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInit = (log: any) => {
    setEditingId(log.id);
    setSelectedMood(log.mood);
    setIntensity(log.intensity);
    setStress(log.stress);
    setEnergy(log.energy);
    setNotes(log.notes);
    setReasons(log.reasons);
  };

  // Process data for mood distributions chart
  const moodCounts: Record<string, number> = {};
  moods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const chartData = Object.keys(moodCounts).map(mood => ({
    name: mood,
    count: moodCounts[mood],
    emoji: moodEmojis[mood] || '😊'
  }));

  // Calendar Logs representation (last 15 days)
  const sortedMoods = [...moods].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Mood & Wellness Logs</h2>
        <p className="text-slate-500 text-sm mt-1">Reflect on your daily states and trace mental triggers over time.</p>
      </section>

      {/* Main logging grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mood Check-In Form */}
        <section className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <span>Daily Check-In</span>
            <Sparkles size={16} className="text-accent-sky" />
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mood Emojis */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                How do you feel right now?
              </label>
              <div className="flex flex-wrap gap-2.5">
                {Object.keys(moodEmojis).map(moodName => {
                  const isSelected = selectedMood === moodName;
                  return (
                    <button
                      key={moodName}
                      type="button"
                      onClick={() => setSelectedMood(moodName)}
                      className={`
                        px-4 py-3 rounded-2xl border text-sm font-semibold flex items-center space-x-2 transition-all duration-200
                        ${isSelected 
                          ? 'bg-accent-sky/10 border-accent-sky text-accent-sky shadow-xs scale-105' 
                          : 'bg-white border-slate-200/50 text-slate-600 hover:border-slate-300'}
                      `}
                    >
                      <span className="text-lg">{moodEmojis[moodName]}</span>
                      <span>{moodName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Intensity</span>
                  <span className="text-slate-800 font-bold">{intensity} / 10</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={intensity}
                  onChange={e => setIntensity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-sky"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Stress Level</span>
                  <span className="text-accent-coral font-bold">{stress} / 10</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={stress}
                  onChange={e => setStress(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-coral"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Energy Level</span>
                  <span className="text-accent-lavender font-bold">{energy} / 10</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={energy}
                  onChange={e => setEnergy(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-lavender"
                />
              </div>
            </div>

            {/* Trigger Reason Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-3">What is influencing your mood?</label>
              <div className="flex flex-wrap gap-2">
                {reasonTags.map(tag => {
                  const isSelected = reasons.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleReason(tag)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                        ${isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                          : 'bg-white border-slate-200/60 text-slate-500 hover:border-slate-300'}
                      `}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Reflection Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Write down any mental logs or notes about why you feel this way..."
                rows={3}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs focus:outline-hidden focus:bg-white focus:border-accent-sky"
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <Plus size={14} />
                <span>{submitting ? 'Logging...' : editingId ? 'Update Mood Check-In' : 'Log Mood Check-In'}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNotes('');
                    setReasons([]);
                  }}
                  className="px-4 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel Edit
                </button>
              )}
            </div>

          </form>
        </section>

        {/* Mood Distribution Chart Card */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Mood Distribution</h3>
            <p className="text-xs text-slate-400">Prevalent logs in your wellness cycle</p>
          </div>

          <div className="h-60 w-full mt-6">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No logs recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: 'none' }} />
                  <Bar dataKey="count" fill="#A78BFA" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-4 p-4 bg-accent-sky/5 rounded-2xl border border-accent-sky/10 flex items-start space-x-2.5 text-left">
            <Sparkles className="text-accent-sky shrink-0 mt-0.5" size={14} />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Your most frequent mood state is <strong className="text-slate-700">Calm</strong>, indicating a healthy, regulated emotional baseline.
            </p>
          </div>
        </section>

      </div>

      {/* Mood History Calendar list */}
      <section className="bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/60">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
          <Calendar size={18} className="text-accent-lavender" />
          <span>Mood & Reflection Logs Timeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
          {sortedMoods.map(log => (
            <div 
              key={log.id} 
              className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between text-left space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{moodEmojis[log.mood] || '🧘'}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{log.mood}</h4>
                    <span className="text-[9px] text-slate-400">
                      {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="flex space-x-1">
                    {log.reasons.slice(0, 2).map(r => (
                      <span key={r} className="text-[9px] bg-slate-50 border border-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                        {r}
                      </span>
                    ))}
                  </div>
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
                      if (confirm("Are you sure you want to delete this mood log?")) {
                        deleteMood(log.id);
                      }
                    }}
                    className="p-1 text-slate-300 hover:text-accent-coral rounded-md hover:bg-slate-50"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>

              {log.notes && (
                <p className="text-[11px] text-slate-500 italic line-clamp-2">
                  "{log.notes}"
                </p>
              )}

              <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-2 text-center text-[10px]">
                <div>
                  <span className="text-slate-400 block">Stress</span>
                  <span className="font-semibold text-slate-700">{log.stress}/10</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Energy</span>
                  <span className="font-semibold text-slate-700">{log.energy}/10</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Intensity</span>
                  <span className="font-semibold text-slate-700">{log.intensity}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
