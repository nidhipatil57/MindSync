import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { BackgroundBlobs } from '../components/BackgroundBlobs';

export const OnboardingPage: React.FC = () => {
  const { submitOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    age: 21,
    occupation: 'Student',
    stressLevel: 5,
    sleepHours: 7,
    goals: [] as string[],
    habits: [] as string[],
    preferredWakeTime: '06:30',
    preferredSleepTime: '22:30',
    workoutFrequency: '3 times/week',
    screenTime: '5 hours',
    notificationPreference: 'encouraging',
    themePreference: 'light-calm'
  });

  const goalsList = [
    'Reduce Stress & Anxiety',
    'Improve Focus & Flow',
    'Sleep Better & Consistent Hours',
    'Build Healthier Habits',
    'Prevent Academic/Work Burnout',
    'Boost Social Confidence'
  ];

  const habitsList = [
    'Drink 2L Water',
    '30-minute Workout',
    '10-minute Meditation',
    'Read 10 pages',
    'Limit screen time',
    'Sleep before 11 PM'
  ];

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal) 
        : [...prev.goals, goal]
    }));
  };

  const toggleHabit = (habit: string) => {
    setFormData(prev => ({
      ...prev,
      habits: prev.habits.includes(habit) 
        ? prev.habits.filter(h => h !== habit) 
        : [...prev.habits, habit]
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setGenerating(true);
    // Simulate complex profile generation by AI
    setTimeout(async () => {
      try {
        await submitOnboarding(formData);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        setGenerating(false);
      }
    }, 2500);
  };

  const progressPercent = (step / 4) * 100;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <BackgroundBlobs />
      
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-xl relative min-h-[500px] flex flex-col justify-between">
        
        {/* Loading overlay for AI generation */}
        {generating && (
          <div className="absolute inset-0 bg-white/90 rounded-3xl z-55 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-sky to-accent-lavender flex items-center justify-center text-white mb-6 shadow-md shadow-accent-lavender/35 animate-bounce">
              <Brain size={32} />
            </div>
            <Loader2 className="animate-spin text-accent-lavender mb-4" size={28} />
            <h3 className="text-xl font-bold text-slate-800">Generating Wellness Profile</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-sm">
              MindSync AI is compiling your goals, calculating baseline burnout risk, and preparing customized coaching reminders...
            </p>
          </div>
        )}

        {/* Top Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round(progressPercent)}% complete</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-accent-sky to-accent-lavender h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Contents */}
        <div className="flex-1 mb-8">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Tell us about yourself</h3>
                <p className="text-slate-500 text-sm mt-1">This helps us customize daily study and workout recommendations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Age</label>
                  <input 
                    type="number" 
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) || 20 })}
                    className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Occupation / Role</label>
                  <select 
                    value={formData.occupation}
                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky"
                  >
                    <option value="Student">Student (College/School)</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Self Employed">Self Employed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Estimated Screen Time (Daily)</label>
                <select 
                  value={formData.screenTime}
                  onChange={e => setFormData({ ...formData, screenTime: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky"
                >
                  <option value="2-4 hours">2-4 hours</option>
                  <option value="4-6 hours">4-6 hours</option>
                  <option value="6-8 hours">6-8 hours</option>
                  <option value="8+ hours">8+ hours (High risk)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Stress & Sleep */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Stress & Sleep Patterns</h3>
                <p className="text-slate-500 text-sm mt-1">We align your sleep offset target with stress reduction programs.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase mb-2">
                  <span>Daily Stress Level</span>
                  <span className="text-accent-lavender font-bold">{formData.stressLevel} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10"
                  value={formData.stressLevel}
                  onChange={e => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent-lavender"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Peaceful (1)</span>
                  <span>Moderate (5)</span>
                  <span>Overwhelmed (10)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Sleep Target (Hours)</label>
                  <input 
                    type="number" 
                    step="0.5"
                    value={formData.sleepHours}
                    onChange={e => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) || 7 })}
                    className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Workout Frequency</label>
                  <select 
                    value={formData.workoutFrequency}
                    onChange={e => setFormData({ ...formData, workoutFrequency: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden"
                  >
                    <option value="Rarely">Rarely</option>
                    <option value="1-2 times/week">1-2 times/week</option>
                    <option value="3 times/week">3 times/week</option>
                    <option value="Daily">Daily</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Goals Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">What are your wellness goals?</h3>
                <p className="text-slate-500 text-sm mt-1">Choose all that apply. These direct your Daily AI Coach recommendations.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                {goalsList.map(goal => {
                  const isSelected = formData.goals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`
                        w-full px-4 py-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all duration-200
                        ${isSelected 
                          ? 'bg-accent-sky/10 border-accent-sky text-accent-sky shadow-xs' 
                          : 'bg-white border-slate-200/60 text-slate-600 hover:border-slate-300'}
                      `}
                    >
                      <span>{goal}</span>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Habits Builder */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Select starting habits</h3>
                <p className="text-slate-500 text-sm mt-1">We will pre-configure these on your Habit Builder dashboard card.</p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                {habitsList.map(habit => {
                  const isSelected = formData.habits.includes(habit);
                  return (
                    <button
                      key={habit}
                      type="button"
                      onClick={() => toggleHabit(habit)}
                      className={`
                        w-full px-4 py-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all duration-200
                        ${isSelected 
                          ? 'bg-accent-lavender/10 border-accent-lavender text-accent-lavender shadow-xs' 
                          : 'bg-white border-slate-200/60 text-slate-600 hover:border-slate-300'}
                      `}
                    >
                      <span>{habit}</span>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            className={`
              px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 flex items-center space-x-1.5 transition-all
              ${step === 1 ? 'opacity-0 pointer-events-none' : ''}
            `}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center space-x-1.5 shadow-md shadow-slate-900/10 active:scale-95 transition-all"
          >
            <span>{step === 4 ? 'Finish Setup' : 'Continue'}</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
