import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { 
  Sparkles, Coffee, Droplet, Plus, CheckCircle, 
  Smile, Moon, Zap, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    moods, habits, tasks, sleep, burnout, coachBriefing, 
    addTask, toggleTask, toggleHabit, refreshAll 
  } = useWellness();

  // Dashboard state overrides
  const [waterIntake, setWaterIntake] = useState(1.2); // liters
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [quote, setQuote] = useState({
    text: "Your calm mind is the ultimate weapon against your challenges. So relax.",
    author: "Bryant McGill"
  });

  // Fetch daily quotes dynamically or keep a premium list
  const quotesList = [
    { text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.", author: "Hermann Hesse" },
    { text: "Your calm mind is the ultimate weapon against your challenges. So relax.", author: "Bryant McGill" },
    { text: "Flow is the sweet spot between boredom and anxiety.", author: "Mihaly Csikszentmihalyi" },
    { text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.", author: "Thich Nhat Hanh" }
  ];

  useEffect(() => {
    const idx = Math.floor(Math.random() * quotesList.length);
    setQuote(quotesList[idx]);
    refreshAll();
  }, []);

  const handleAddWater = () => {
    setWaterIntake(prev => Number((prev + 0.25).toFixed(2)));
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(newTaskTitle, 'Productivity');
    setNewTaskTitle('');
  };

  // Process chart data from Mood logs
  const chartData = moods.slice(-7).map(m => ({
    name: new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' }),
    stress: m.stress,
    energy: m.energy,
    productivity: m.productivity
  }));

  const activeUserScore = user?.wellnessScore || 78;

  // Recent sleep
  const lastSleep = sleep[sleep.length - 1] || { duration: 7.0, quality: 75 };

  // Recent mood
  const currentMood = moods[moods.length - 1] || { mood: 'Calm', intensity: 7 };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Greeting */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">
            Good morning, <span className="bg-gradient-to-r from-accent-sky to-accent-lavender bg-clip-text text-transparent">{user?.name || 'Nidhi'}</span>.
          </h2>
          <p className="text-slate-500 text-sm mt-1">Here is how your wellbeing looks today.</p>
        </div>

        {/* Daily Quote Card */}
        <div className="max-w-md bg-white/70 p-4 rounded-2xl border border-slate-100 flex items-start space-x-3 text-left">
          <Coffee className="text-accent-peach shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-xs italic text-slate-600">"{quote.text}"</p>
            <span className="text-[10px] text-slate-400 block mt-1">— {quote.author}</span>
          </div>
        </div>
      </section>

      {/* Main Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Wellness Score Ring */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-4">Wellness Index</span>
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Radial Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="64" cy="64" r="50" 
                className="stroke-slate-100" 
                strokeWidth="10" 
                fill="transparent"
              />
              <circle 
                cx="64" cy="64" r="50" 
                className="stroke-accent-lavender transition-all duration-500" 
                strokeWidth="10" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - activeUserScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-800">{activeUserScore}</span>
              <span className="text-xs text-slate-400 block font-semibold">/ 100</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Your index is <strong className="text-accent-mint">highly stable</strong> based on sleep & journaling indicators.
          </p>
        </div>

        {/* Current Mood Status */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Current Mood</span>
            <div className="w-9 h-9 rounded-xl bg-accent-sky/10 text-accent-sky flex items-center justify-center">
              <Smile size={18} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold text-slate-800 capitalize">{currentMood.mood}</h3>
            <p className="text-xs text-slate-400 mt-1">Intensity Level: {currentMood.intensity}/10</p>
          </div>
          <span className="text-[11px] text-accent-sky bg-accent-sky/5 px-2.5 py-1 rounded-lg self-start font-semibold">
            Last logged: Just now
          </span>
        </div>

        {/* Sleep Intelligence */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Sleep Hours</span>
            <div className="w-9 h-9 rounded-xl bg-accent-lavender/10 text-accent-lavender flex items-center justify-center">
              <Moon size={18} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold text-slate-800">{lastSleep.duration} hrs</h3>
            <p className="text-xs text-slate-400 mt-1">Sleep Quality: {lastSleep.quality}%</p>
          </div>
          <span className="text-[11px] text-accent-lavender bg-accent-lavender/5 px-2.5 py-1 rounded-lg self-start font-semibold">
            Target: 8.0 hrs
          </span>
        </div>

        {/* Burnout risk gauge preview */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Burnout Risk</span>
            <div className="w-9 h-9 rounded-xl bg-accent-coral/10 text-accent-coral flex items-center justify-center">
              <Zap size={18} />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-3xl font-extrabold text-slate-800">
              {burnout ? burnout.riskLevel : 'Medium'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Risk index: {burnout ? burnout.score : 45}%</p>
          </div>
          <span className="text-[11px] text-accent-coral bg-accent-coral/5 px-2.5 py-1 rounded-lg self-start font-semibold">
            Status: Take stretch breaks
          </span>
        </div>

      </section>

      {/* Analytics, Tasks & Coaching row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Area Chart */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Weekly Stress & Energy Trend</h3>
              <p className="text-xs text-slate-400">Analysis correlated from mood logs</p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="stress" stroke="#F87171" strokeWidth={2} fillOpacity={1} fill="url(#colorStress)" name="Stress Level" />
                <Area type="monotone" dataKey="energy" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorEnergy)" name="Energy Level" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily AI Coach Card */}
        <div className="bg-gradient-to-br from-accent-sky/10 to-accent-lavender/10 p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-accent-lavender">
              <Sparkles size={20} />
              <h3 className="text-lg font-bold text-slate-800">Daily AI Briefing</h3>
            </div>
            
            <div className="text-xs leading-relaxed text-slate-600 whitespace-pre-line max-h-[250px] overflow-y-auto pr-1">
              {coachBriefing || "Good Morning, Nidhi. MindSync AI is scanning your logs for wellness trends. Today, prioritize sleeping before 11 PM and drink at least 2L of water to paid off mid-week stress spikes. Have a peaceful day!"}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-4">
            <span>Refreshed: 8:00 AM</span>
            <span className="text-accent-lavender font-semibold cursor-pointer hover:underline flex items-center">
              Insights <ChevronRight size={14} />
            </span>
          </div>
        </div>

      </section>

      {/* Lower Row: Habit checklist, Tasks & Water logger */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Habit tracker Quick check */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Habit Quick-Check</h3>
          <div className="space-y-3">
            {habits.slice(0, 4).map(habit => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isChecked = !!habit.history[todayStr];
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`
                    w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all duration-200
                    ${isChecked 
                      ? 'bg-accent-mint/10 border-accent-mint/20 text-accent-mint' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/50'}
                  `}
                >
                  <span className="text-xs font-semibold">{habit.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400 font-medium">Streak: {habit.streak}d</span>
                    <div className={`
                      w-5 h-5 rounded-full border flex items-center justify-center
                      ${isChecked ? 'bg-accent-mint border-accent-mint text-white' : 'border-slate-300'}
                    `}>
                      {isChecked && <CheckCircle size={12} className="fill-current" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tasks Planner */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Today's Schedule</h3>
          
          <form onSubmit={handleCreateTask} className="flex space-x-2 mb-4">
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Add quick task..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-hidden"
            />
            <button type="submit" className="p-2 bg-slate-900 text-white rounded-xl text-xs hover:bg-slate-800">
              <Plus size={16} />
            </button>
          </form>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 hide-scrollbar">
            {tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).map(task => (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
              >
                <div className={`
                  w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0
                  ${task.completed ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300'}
                `}>
                  {task.completed && <CheckCircle size={10} className="fill-current" />}
                </div>
                <span className={`text-xs text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Water Hydration Tracker */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hydration Index</h3>
            <p className="text-xs text-slate-400">Keep your energy flow stable</p>
          </div>

          <div className="my-6 flex items-center justify-center space-x-6">
            <div className="relative">
              {/* Glass Wave container */}
              <div className="w-16 h-28 border-2 border-slate-200/80 rounded-b-xl rounded-t-sm bg-slate-50/20 overflow-hidden relative shadow-inner">
                {/* Wave Filler */}
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-accent-sky/40 transition-all duration-500"
                  style={{ height: `${Math.min(100, (waterIntake / 2.0) * 100)}%` }}
                />
              </div>
            </div>
            
            <div className="text-left">
              <span className="text-3xl font-extrabold text-slate-800">{waterIntake}L</span>
              <span className="text-xs text-slate-400 block">Target: 2.0L</span>
              <button 
                onClick={handleAddWater}
                className="mt-3 px-4 py-2 bg-accent-sky text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 hover:bg-accent-sky/90 active:scale-95 transition-all shadow-xs"
              >
                <Droplet size={12} />
                <span>Add 250ml</span>
              </button>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-400 text-center">
            {waterIntake >= 2.0 ? "🎉 Daily hydration goals achieved!" : "Drink glass of water to complete target."}
          </p>
        </div>

      </section>
    </div>
  );
};
