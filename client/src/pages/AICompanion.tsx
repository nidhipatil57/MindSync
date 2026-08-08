import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Brain, Send, Mic, Sparkles, AlertTriangle, Square } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

export const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Guide me through a 2-minute breathing exercise",
    "I am feeling highly anxious about exams",
    "Give me 3 tips to boost my focus today",
    "I need an emergency calming exercise"
  ];

  const fetchChatHistory = async () => {
    try {
      const history = await api.get('/api/ai/chat');
      setMessages(history);
    } catch (err) {
      console.error('Failed to load chat logs', err);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message locally
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.post('/api/ai/chat', { message: text });
      setMessages(prev => [...prev, response]);
    } catch (err) {
      console.error(err);
      // Fallback local response just in case server is down or error
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: "I am having trouble connecting to my cognitive services, but I am still here to support you. Let's take a slow breath. Inhale for 4 seconds, hold for 4, and release. You are doing great.",
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      // Send simulated transcript
      handleSendMessage("I am feeling a bit lonely and overwhelmed by work.");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] lg:h-screen flex flex-col justify-between">
      
      {/* AI Header Card */}
      <section className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Calming breathing avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-sky to-accent-lavender flex items-center justify-center text-white shadow-md animate-breathe" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-mint rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-1">
              <span>MindSync Companion</span>
              <Sparkles size={12} className="text-accent-lavender" />
            </h3>
            <p className="text-[10px] text-slate-400">Empathic AI Wellbeing Coach</p>
          </div>
        </div>

        {/* SOS Alert badge */}
        <div className="flex items-center space-x-2 text-[10px] text-amber-500 font-bold bg-amber-50 border border-amber-100/50 px-3 py-1 rounded-full">
          <AlertTriangle size={12} />
          <span>SOS triggers active in Safe Circle</span>
        </div>
      </section>

      {/* Messages Scroll Area */}
      <section className="flex-1 overflow-y-auto my-6 pr-1 space-y-4 hide-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-accent-sky/10 text-accent-sky flex items-center justify-center animate-pulse">
              <Brain size={32} />
            </div>
            <h4 className="font-bold text-slate-800">Start a calm conversation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log your thoughts, seek comfort, ask for breathing cues, or practice public speaking scripts. Your logs are secure.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isModel = msg.role === 'model';
            return (
              <div 
                key={msg.id}
                className={`flex ${isModel ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                <div className={`
                  max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-xs
                  ${isModel 
                    ? 'bg-white text-slate-700 rounded-tl-sm border border-slate-100/60' 
                    : 'bg-gradient-to-r from-accent-sky to-accent-lavender text-white rounded-tr-sm'}
                `}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/70 p-4 rounded-2xl rounded-tl-sm border border-slate-100/60 flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}

        {/* Microphone active indicator */}
        {isRecording && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-full flex items-center space-x-2 text-[10px] font-semibold animate-pulse">
              <Square size={10} className="fill-current" />
              <span>Simulating Voice Transcription. Tap mic again to stop...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </section>

      {/* Suggested prompts list */}
      {messages.length < 3 && (
        <section className="mb-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 text-left">Suggested Actions</p>
          <div className="flex flex-wrap gap-2 justify-start">
            {suggestedPrompts.map(p => (
              <button
                key={p}
                onClick={() => handleSendMessage(p)}
                className="px-3 py-1.5 bg-white border border-slate-100 hover:border-slate-300 rounded-full text-[10px] font-semibold text-slate-500 transition-all"
              >
                {p}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Input bar */}
      <section className="bg-white/70 backdrop-blur-md p-2 rounded-2xl border border-slate-100 flex items-center space-x-2">
        <button 
          onClick={handleMicClick}
          className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-100 text-red-500' : 'text-slate-400 hover:bg-slate-100'}`}
        >
          <Mic size={20} />
        </button>
        
        <input 
          type="text" 
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="Share your feelings or ask for breathing exercise..."
          className="flex-1 bg-transparent px-2 py-3 text-xs focus:outline-hidden text-slate-700"
        />

        <button 
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || loading}
          className="p-3 bg-gradient-to-r from-accent-sky to-accent-lavender text-white rounded-xl shadow-xs hover:opacity-90 active:scale-95 transition-all"
        >
          <Send size={16} />
        </button>
      </section>
    </div>
  );
};
