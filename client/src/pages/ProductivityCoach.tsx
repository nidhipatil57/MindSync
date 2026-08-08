import React, { useState, useEffect } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Play, Pause, RotateCcw, Plus, Trash2, Volume2, VolumeX, Check 
} from 'lucide-react';

export const ProductivityCoach: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useWellness();

  // Pomodoro states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Task creation Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Studies');

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished!
          setIsActive(false);
          setMinutes(25);
          setSeconds(0);
          if (soundEnabled) {
            // Mock alert sound
            alert("Focus session complete! Take a deep breath.");
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    await addTask(taskTitle, taskCategory);
    setTaskTitle('');
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Productivity Coach</h2>
        <p className="text-slate-500 text-sm mt-1">Organize study/work tasks, use Pomodoro focus blocks, and review schedules.</p>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pomodoro Timer widget */}
        <section className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white flex flex-col items-center justify-between text-center shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Focus Session</h3>
            <p className="text-xs text-slate-400">Work in intervals to prevent mental fatigue</p>
          </div>

          <div className="my-10 relative flex flex-col items-center">
            {/* Big Timer display */}
            <h1 className="text-6xl font-extrabold text-slate-800 select-none tabular-nums font-sans">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </h1>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
              {isActive ? 'Deep Focus Active' : 'Resting'}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 w-full max-w-[240px]">
            <button 
              onClick={handleToggleTimer}
              className={`
                flex-1 py-3 text-xs font-semibold rounded-xl text-white shadow-xs transition-all flex items-center justify-center space-x-2
                ${isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-slate-800'}
              `}
            >
              {isActive ? <Pause size={14} /> : <Play size={14} />}
              <span>{isActive ? 'Pause' : 'Start Focus'}</span>
            </button>
            
            <button 
              onClick={handleResetTimer}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"
            >
              <RotateCcw size={16} />
            </button>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-all"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </section>

        {/* Tasks Planner manager */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Today's Schedule</h3>
            <p className="text-xs text-slate-400">Toggle or delete work milestones</p>
            
            {/* Create Task Form */}
            <form onSubmit={handleCreateTask} className="flex space-x-2 mt-4 mb-6">
              <input 
                type="text" value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="New task title..."
                required
                className="flex-grow px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-hidden"
              />
              <select 
                value={taskCategory}
                onChange={e => setTaskCategory(e.target.value)}
                className="px-2 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px]"
              >
                <option value="Studies">Studies</option>
                <option value="Workout">Workout</option>
                <option value="Habit">Habit</option>
                <option value="General">General</option>
              </select>
              <button type="submit" className="p-2 bg-slate-900 text-white rounded-xl text-xs hover:bg-slate-800">
                <Plus size={16} />
              </button>
            </form>

            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1 hide-scrollbar">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center space-x-3 text-left"
                  >
                    <div className={`
                      w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0
                      ${task.completed ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300'}
                    `}>
                      {task.completed && <Check size={10} className="stroke-[3]" />}
                    </div>
                    <span className={`text-xs text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </span>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-slate-300 hover:text-accent-coral"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4 mt-6">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <span>Progress rate</span>
              <span className="text-slate-700 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* AI optimizer tips */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">AI Schedule Optimizer</h3>
            <p className="text-xs text-slate-400">Intelligent flow patterns for college & work</p>
          </div>

          <div className="space-y-4 my-6 text-left">
            <div className="p-3 bg-accent-sky/5 border border-accent-sky/10 rounded-2xl">
              <span className="text-[10px] text-accent-sky font-bold uppercase">Optimal Peak Focus</span>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                Your mood history shows peak energy between **9:00 AM - 11:30 AM**. Log assignments during this block.
              </p>
            </div>

            <div className="p-3 bg-accent-lavender/5 border border-accent-lavender/10 rounded-2xl">
              <span className="text-[10px] text-accent-lavender font-bold uppercase">Work Interval Recommendation</span>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                Based on stress logs, limit focus blocks to **3 Pomodoro iterations (75 mins)** before taking a 15-min walk.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Optimizer updates dynamically based on daily mood intensity.
          </p>
        </section>

      </div>
    </div>
  );
};
