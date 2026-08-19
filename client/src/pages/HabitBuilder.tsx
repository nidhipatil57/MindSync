import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Sparkles, CheckCircle2, Award, Plus, Trash2, 
  Flame, BookOpen, Droplet, Edit 
} from 'lucide-react';

export const HabitBuilder: React.FC = () => {
  const { habits, addHabit, toggleHabit, deleteHabit, updateHabit } = useWellness();

  // Create Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('2 Liters');
  const [frequency, setFrequency] = useState('Daily');
  const [submitting, setSubmitting] = useState(false);

  // Show milestone confetti overlay mockup state
  const [showCelebration, setShowCelebration] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateHabit(editingId, { name, target, frequency });
        setEditingId(null);
      } else {
        await addHabit(name, target, frequency);
      }
      setName('');
      setTarget('2 Liters');
      setFrequency('Daily');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditInit = (habit: any) => {
    setEditingId(habit.id);
    setName(habit.name);
    setTarget(habit.target);
    setFrequency(habit.frequency);
  };

  const handleToggle = async (id: string, currentlyChecked: boolean) => {
    await toggleHabit(id);
    if (!currentlyChecked) {
      // Trigger a 2-second celebratory animation popup!
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 2000);
    }
  };

  const habitIcons: Record<string, any> = {
    'drink water': Droplet,
    'workout': Award,
    'meditation': Sparkles,
    'reading': BookOpen
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-55 bg-white/20 backdrop-blur-xs flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="bg-slate-900 text-white px-8 py-5 rounded-2xl flex items-center space-x-3 shadow-2xl animate-bounce">
            <Flame className="text-yellow-400 fill-current animate-pulse" size={24} />
            <div className="text-left">
              <h4 className="text-sm font-bold">Streak Maintained!</h4>
              <p className="text-[10px] text-slate-400">Keep up the excellent momentum.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Healthy Habit Builder</h2>
          <p className="text-slate-500 text-sm mt-1">Nurture habits without anxiety. Keep consistency streaks alive daily.</p>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Habits list check-off */}
        <section className="lg:col-span-2 space-y-4">
          {habits.length === 0 ? (
            <div className="bg-white/60 p-12 rounded-3xl border border-white text-center text-xs text-slate-400">
              No habits configured yet. Use the sidebar creation tool!
            </div>
          ) : (
            habits.map(habit => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isChecked = !!habit.history[todayStr];
              
              const HabitIcon = habitIcons[habit.name.toLowerCase()] || CheckCircle2;
              
              return (
                <div 
                  key={habit.id}
                  className={`
                    p-6 rounded-3xl border bg-white/70 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300
                    ${isChecked ? 'border-accent-mint/35 bg-accent-mint/5 shadow-xs' : 'border-white'}
                  `}
                >
                  <div className="flex items-start space-x-4 text-left">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                      ${isChecked ? 'bg-accent-mint/15 text-accent-mint' : 'bg-slate-100 text-slate-400'}
                    `}>
                      <HabitIcon size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                        <span>{habit.name}</span>
                        {isChecked && (
                          <span className="text-[9px] bg-accent-mint/20 text-accent-mint px-2 py-0.5 rounded-full font-bold">
                            Complete
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">Goal: {habit.target} / {habit.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                    {/* Streaks count */}
                    <div className="flex items-center space-x-1.5 text-orange-500 font-bold text-sm bg-orange-50 border border-orange-100/50 px-3 py-1.5 rounded-xl">
                      <Flame size={16} className="fill-current" />
                      <span>{habit.streak} day streak</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleToggle(habit.id, isChecked)}
                        className={`
                          px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs
                          ${isChecked 
                            ? 'bg-accent-mint text-white' 
                            : 'bg-slate-900 text-white hover:bg-slate-800'}
                        `}
                      >
                        {isChecked ? 'Uncheck' : 'Complete'}
                      </button>

                      <button 
                        onClick={() => handleEditInit(habit)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <Edit size={16} />
                      </button>

                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="p-2 text-slate-400 hover:text-accent-coral hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Create Habit panel */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Plus size={18} className="text-accent-sky" />
            <span>Create New Habit</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Habit Name</label>
              <input 
                type="text" value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Yoga, Drink Water, Reading"
                required
                className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Target Volume</label>
              <input 
                type="text" value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder="e.g. 30 mins, 2 Liters, 10 pages"
                className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Frequency</label>
              <select 
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="3 times/week">3 times/week</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-xs transition-all"
              >
                <span>{submitting ? 'Saving...' : editingId ? 'Update Habit' : 'Create Habit'}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setTarget('2 Liters');
                    setFrequency('Daily');
                  }}
                  className="px-4 py-3.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Habit recommendations block */}
          <div className="mt-6 p-4 bg-accent-sky/5 rounded-2xl border border-accent-sky/10 flex items-start space-x-2 text-left">
            <Sparkles className="text-accent-sky shrink-0 mt-0.5" size={14} />
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">AI Coach Recommendation</span>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                Consider adding "Limit Screen Time" to paid off high cognitive stress logs.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
