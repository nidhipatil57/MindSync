import React, { useState } from 'react';
import { api } from '../services/api';
import { Brain, Sparkles, Send, Award, Play } from 'lucide-react';

interface RoleplayMessage {
  role: 'user' | 'model';
  text: string;
}

interface FeedbackInfo {
  confidenceScore: number;
  speed: string;
  fillerWords: string[];
  suggestions: string[];
}

export const SocialConfidence: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState('interview');
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Feedback results
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);

  const scenarios = [
    { id: 'interview', name: "Placement Interview", description: "Practice corporate technical and HR inquiries." },
    { id: 'presentation', name: "Project Q&A Defense", description: "Defend project architectural designs in peer panels." },
    { id: 'networking', name: "Networking Mixer", description: "Initiate conversation with professional developers." },
    { id: 'casual', name: "Casual Catchup", description: "Practice friendly, low-stress discussions." }
  ];

  const handleStartSession = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setLoading(true);
    setFeedback(null);
    setMessages([]);
    try {
      const response = await api.post('/api/social/chat', { scenario: scenarioId, startOver: true });
      setMessages(response.history);
      setSessionActive(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    setLoading(true);

    // Add user message locally
    setMessages(prev => [...prev, { role: 'user', text }]);

    try {
      const response = await api.post('/api/social/chat', { scenario: selectedScenario, message: text });
      setMessages(response.history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishSession = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/social/feedback', { scenario: selectedScenario });
      setFeedback(response);
      setSessionActive(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Social Confidence Trainer</h2>
        <p className="text-slate-500 text-sm mt-1">AI Roleplay sandbox to practice interviews, presentations, and mixers in safety.</p>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Scenario Selection list */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">Scenarios</h3>
          <div className="space-y-3">
            {scenarios.map(sc => {
              const isSelected = selectedScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => !sessionActive && setSelectedScenario(sc.id)}
                  disabled={sessionActive}
                  className={`
                    w-full p-4 rounded-2xl border text-left flex flex-col transition-all duration-200
                    ${isSelected 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-white/70 border-slate-200/50 text-slate-700 hover:bg-white'}
                    ${sessionActive && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span className="text-xs font-bold">{sc.name}</span>
                  <span className={`text-[10px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {sc.description}
                  </span>
                </button>
              );
            })}
          </div>

          {!sessionActive ? (
            <button
              onClick={() => handleStartSession(selectedScenario)}
              className="w-full py-4 bg-gradient-to-r from-accent-sky to-accent-lavender text-white font-semibold rounded-2xl shadow-md flex items-center justify-center space-x-1.5"
            >
              <Play size={14} className="fill-current" />
              <span>Start Roleplay Session</span>
            </button>
          ) : (
            <button
              onClick={handleFinishSession}
              className="w-full py-4 bg-accent-coral text-white font-semibold rounded-2xl shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>Get AI Performance Grade</span>
            </button>
          )}
        </section>

        {/* Chat / Dialogue pane */}
        <section className="lg:col-span-2 flex flex-col justify-between min-h-[460px] bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
          {/* Active dialogue or placeholder */}
          <div className="flex-1 overflow-y-auto space-y-4 max-h-[350px] hide-scrollbar mb-4">
            {!sessionActive && !feedback ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto">
                <div className="w-14 h-14 bg-accent-sky/10 text-accent-sky rounded-2xl flex items-center justify-center">
                  <Brain size={24} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Awaiting Roleplay Launch</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select a practice scenario on the left, then click start. The AI will initiate the prompt.
                </p>
              </div>
            ) : feedback ? (
              /* Feedback results display */
              <div className="space-y-6 text-left animate-fade-in">
                <div className="flex justify-between items-center bg-accent-sky/5 p-4 rounded-2xl border border-accent-sky/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-sky/15 text-accent-sky flex items-center justify-center">
                      <Award size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Confidence Rating</h4>
                      <span className="text-[10px] text-slate-400">Calculated speech pace & tone</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-extrabold text-accent-sky">{feedback.confidenceScore}%</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Speaking Speed</span>
                    <p className="text-xs text-slate-700 font-medium">{feedback.speed}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Filler Words Detected</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {feedback.fillerWords.map(w => (
                        <span key={w} className="text-[9px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-full font-bold">
                          "{w}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Tactical Suggestions</span>
                  <ul className="space-y-2.5">
                    {feedback.suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-50">
                        <Sparkles size={14} className="text-accent-lavender shrink-0 mt-0.5 mr-2.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* Dialog Bubble history */
              messages.map((m, idx) => {
                const isModel = m.role === 'model';
                return (
                  <div key={idx} className={`flex ${isModel ? 'justify-start' : 'justify-end'} animate-fade-in`}>
                    <div className={`
                      max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs
                      ${isModel ? 'bg-slate-50 text-slate-700 rounded-tl-sm border border-slate-100/40' : 'bg-slate-900 text-white rounded-tr-sm'}
                    `}>
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-sm border border-slate-100 flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Interactive typing bar */}
          {sessionActive && (
            <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl flex items-center space-x-2">
              <input 
                type="text" 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your response to the interviewer..."
                className="flex-1 bg-transparent px-3 py-2.5 text-xs focus:outline-hidden text-slate-700"
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};
