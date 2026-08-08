import React, { useState, useEffect } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  AlertTriangle, ShieldAlert, Sparkles, CheckSquare
} from 'lucide-react';

export const BurnoutPrediction: React.FC = () => {
  const { burnout, refreshAll } = useWellness();
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    refreshAll();
  }, []);

  const toggleCheck = (item: string) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const defaultBurnout = {
    score: 45,
    riskLevel: 'Medium' as const,
    reasons: [
      'Screen time averages over 6 hours.',
      'Sleep averages under 7 hours in the last week.',
      'Recent mood logs indicate moderate anxiety levels.'
    ],
    recoveryPlan: [
      'Take a 5-minute stretch break every 90 minutes.',
      'Activate a 1-hour Digital Detox block before sleep.',
      'Log at least one journal entry to offload mental clutter.'
    ],
    weeklySuggestions: [
      'Limit late night screen usage.',
      'Do a 10-minute guided meditation.'
    ]
  };

  const data = burnout || defaultBurnout;

  const scoreColor = 
    data.riskLevel === 'High' ? 'text-accent-coral stroke-accent-coral border-accent-coral' : 
    data.riskLevel === 'Medium' ? 'text-amber-500 stroke-amber-500 border-amber-500' : 
    'text-accent-mint stroke-accent-mint border-accent-mint';

  const riskBadge = 
    data.riskLevel === 'High' ? 'bg-red-50 text-accent-coral border-accent-coral/20' : 
    data.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-500 border-amber-500/20' : 
    'bg-emerald-50 text-accent-mint border-accent-mint/20';

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Burnout Prediction</h2>
        <p className="text-slate-500 text-sm mt-1">AI-driven predictive index analyzing screen time, sleep quality, and active stress levels.</p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Needle Risk Gauge circular ring */}
        <section className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-white flex flex-col items-center justify-center text-center shadow-xs">
          <span className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-6">Burnout Risk Index</span>
          
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="88" cy="88" r="70" 
                className="stroke-slate-100" 
                strokeWidth="12" 
                fill="transparent"
              />
              <circle 
                cx="88" cy="88" r="70" 
                className={`transition-all duration-700 ${scoreColor}`} 
                strokeWidth="12" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - data.score / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-slate-800">{data.score}%</span>
              <span className="text-[10px] text-slate-400 uppercase block font-bold mt-1 tracking-wider">Risk Score</span>
            </div>
          </div>

          <div className={`mt-6 px-4 py-1.5 rounded-full border text-xs font-bold ${riskBadge}`}>
            {data.riskLevel} Burnout Risk
          </div>
          
          <p className="text-xs text-slate-400 mt-6 leading-relaxed max-w-xs">
            Calculated by correlating sleep debt, screen hours, completed focus timers, and journal emotions.
          </p>
        </section>

        {/* Reasons block */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
              <ShieldAlert className="text-accent-coral" size={18} />
              <span>Stress Factors Detected</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Triggers feeding your burnout score</p>
            
            <ul className="space-y-4">
              {data.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-600 leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-accent-coral shrink-0 mt-1.5 mr-3" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl flex items-start space-x-2.5">
            <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
              If your score exceeds 70%, MindSync will suggest sending a daily check-in report to your Safe Circle contacts.
            </p>
          </div>
        </section>

        {/* Recovery checklist */}
        <section className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs text-left">
          <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center space-x-2">
            <Sparkles className="text-accent-sky animate-pulse" size={18} />
            <span>AI Recovery Checklist</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">Check off actions to lower your burnout index</p>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
            {data.recoveryPlan.map((plan, idx) => {
              const isChecked = !!checklist[plan];
              return (
                <div 
                  key={idx}
                  onClick={() => toggleCheck(plan)}
                  className={`
                    p-3.5 rounded-2xl border flex items-center space-x-3.5 cursor-pointer transition-all duration-200
                    ${isChecked ? 'bg-accent-mint/5 border-accent-mint/20 text-accent-mint' : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/50'}
                  `}
                >
                  <div className={`
                    w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0
                    ${isChecked ? 'bg-accent-mint border-accent-mint text-white' : 'border-slate-300'}
                  `}>
                    {isChecked && <CheckSquare size={10} className="fill-current" />}
                  </div>
                  <span className={`text-[11px] leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {plan}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
