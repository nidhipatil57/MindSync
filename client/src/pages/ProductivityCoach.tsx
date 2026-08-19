import React, { useState, useEffect } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Play, Pause, RotateCcw, Trash2, Volume2, VolumeX, Check, Edit 
} from 'lucide-react';

export const ProductivityCoach: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask, updateTask } = useWellness();

  // Pomodoro states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Task creation Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('Studies');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);

  // Filtering & Sorting State
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');

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
    try {
      if (editingId) {
        await updateTask(editingId, {
          title: taskTitle,
          category: taskCategory,
          priority,
          date: deadline
        });
        setEditingId(null);
      } else {
        await addTask(taskTitle, taskCategory, priority, deadline);
      }
      setTaskTitle('');
      setTaskCategory('Studies');
      setPriority('Medium');
      setDeadline(new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditInit = (task: any) => {
    setEditingId(task.id);
    setTaskTitle(task.title);
    setTaskCategory(task.category || 'Studies');
    setPriority(task.priority || 'Medium');
    setDeadline(task.date || new Date().toISOString().split('T')[0]);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const priorityMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

  const filteredTasks = tasks.filter(t => {
    const matchesCategory = filterCategory === 'All' || t.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Completed' && t.completed) || 
      (filterStatus === 'Pending' && !t.completed);
    return matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const pA = priorityMap[a.priority || 'Medium'] || 2;
      const pB = priorityMap[b.priority || 'Medium'] || 2;
      return pB - pA;
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

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
            <form onSubmit={handleCreateTask} className="space-y-3 mt-4 mb-6 text-left">
              <div className="flex space-x-2">
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
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px]"
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-1">
                <button type="submit" className="flex-grow py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all">
                  {editingId ? 'Update Task' : 'Add Task'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setTaskTitle('');
                      setTaskCategory('Studies');
                      setPriority('Medium');
                      setDeadline(new Date().toISOString().split('T')[0]);
                    }}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap gap-2 mb-4 text-left border-t border-slate-100 pt-3">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-semibold text-slate-500"
              >
                <option value="All">All Categories</option>
                <option value="Studies">Studies</option>
                <option value="Workout">Workout</option>
                <option value="Habit">Habit</option>
                <option value="General">General</option>
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-semibold text-slate-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-semibold text-slate-500 ml-auto"
              >
                <option value="date">Sort by Date</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>

            <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1 hide-scrollbar">
              {filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center space-x-3 text-left flex-1"
                  >
                    <div className={`
                      w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0
                      ${task.completed ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300'}
                    `}>
                      {task.completed && <Check size={10} className="stroke-[3]" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-semibold text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                      <div className="flex space-x-2 mt-0.5">
                        <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.2 rounded-sm font-semibold">
                          {task.category || 'General'}
                        </span>
                        {task.priority && (
                          <span className={`text-[8px] px-1.5 py-0.2 rounded-sm font-bold ${task.priority === 'High' ? 'bg-red-50 text-accent-coral' : task.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                            {task.priority}
                          </span>
                        )}
                        <span className="text-[8px] text-slate-400 font-medium">
                          {task.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleEditInit(task)}
                      className="p-1 text-slate-300 hover:text-slate-600 rounded-md"
                    >
                      <Edit size={12} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-slate-300 hover:text-accent-coral"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
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
