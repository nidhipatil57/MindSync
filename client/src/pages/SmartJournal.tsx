import React, { useState, useEffect } from 'react';
import { useWellness } from '../context/WellnessContext';
import { 
  Sparkles, Mic, Image, Lock, Unlock, Search 
} from 'lucide-react';

export const SmartJournal: React.FC = () => {
  const { journals, addJournal } = useWellness();

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [reflection, setReflection] = useState('');
  const [privateMode, setPrivateMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voiceSimulating, setVoiceSimulating] = useState(false);

  // Search & active journal displays
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);

  const prompts = [
    "What are three small things you are grateful for today?",
    "Write about a recent situation that caused stress. How did you react?",
    "Describe a moment today when you felt completely relaxed and present.",
    "What is one goal you want to focus on tomorrow?"
  ];
  const [activePrompt, setActivePrompt] = useState(prompts[0]);

  useEffect(() => {
    if (journals.length > 0 && !selectedJournalId) {
      setSelectedJournalId(journals[0].id);
    }
  }, [journals]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const saved = await addJournal({
        title: title || 'Reflections',
        content,
        privateMode,
        gratitude,
        reflection
      });
      // Select the new journal
      setSelectedJournalId(saved.id);
      // Reset form
      setTitle('');
      setContent('');
      setGratitude('');
      setReflection('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const startVoiceDictation = () => {
    if (voiceSimulating) {
      setVoiceSimulating(false);
      setContent(prev => prev + " Woke up feeling slightly more aligned. Wrote down my tasks, drank a full glass of water, and did a brief stretching block. I feel focused.");
    } else {
      setVoiceSimulating(true);
    }
  };

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeJournal = journals.find(j => j.id === selectedJournalId);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 font-sans">Smart AI Journal</h2>
          <p className="text-slate-500 text-sm mt-1">Reflect, offload stress, and let AI analyze sentiment and triggers.</p>
        </div>

        {/* Prompt pill selector */}
        <button 
          onClick={() => {
            const idx = Math.floor(Math.random() * prompts.length);
            setActivePrompt(prompts[idx]);
          }}
          className="px-4 py-2 bg-accent-lavender/10 text-accent-lavender text-xs font-semibold rounded-full border border-accent-lavender/15 hover:bg-accent-lavender/15 transition-all self-start md:self-center"
        >
          🎲 Cycle Reflection Prompt
        </button>
      </section>

      {/* Editor & Sidebar layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Form Panel */}
        <section className="lg:col-span-2 bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-white shadow-xs">
          
          <div className="mb-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500 italic text-left">
            💡 <strong>Reflection Prompt:</strong> {activePrompt}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Title / Private */}
            <div className="flex justify-between items-center gap-4">
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Journal Entry Title..."
                className="flex-1 px-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm font-semibold focus:outline-hidden text-slate-800"
              />
              
              <button
                type="button"
                onClick={() => setPrivateMode(!privateMode)}
                className={`p-3 rounded-xl border transition-all ${privateMode ? 'bg-amber-50 text-amber-500 border-amber-100' : 'text-slate-400 border-slate-200'}`}
              >
                {privateMode ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
            </div>

            {/* Content body */}
            <div className="relative">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Start writing your thoughts here..."
                rows={8}
                required
                className="w-full p-4 bg-white border border-slate-200/60 rounded-2xl text-xs focus:outline-hidden focus:border-accent-sky text-slate-700 leading-relaxed"
              />

              {/* Dictation animation overlay */}
              {voiceSimulating && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <div className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-full flex items-center space-x-2 text-[10px] font-semibold animate-pulse shadow-xs">
                    <div className="w-1.5 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1.5 h-4.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-1.5 h-3 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span>Listening... Tap dictation again to append mock speech.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sub-inputs: Gratitude & Reflections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Today's Gratitude Entry</label>
                <input 
                  type="text" 
                  value={gratitude}
                  onChange={e => setGratitude(e.target.value)}
                  placeholder="I am grateful for..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Daily Reflection Notes</label>
                <input 
                  type="text" 
                  value={reflection}
                  onChange={e => setReflection(e.target.value)}
                  placeholder="Lessons or insights learned..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            </div>

            {/* Toolbar & Save */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={startVoiceDictation}
                  className={`p-2.5 rounded-lg border text-slate-500 hover:bg-slate-50 transition-all ${voiceSimulating ? 'bg-red-50 border-red-100 text-red-500' : 'border-slate-200'}`}
                >
                  <Mic size={14} />
                </button>
                <button
                  type="button"
                  className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                >
                  <Image size={14} />
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Sparkles size={14} />
                <span>{submitting ? 'Analyzing & Saving...' : 'Save & Analyze Entry'}</span>
              </button>
            </div>

          </form>
        </section>

        {/* Sidebar Index & Analysis */}
        <section className="space-y-6">
          
          {/* Active Journal Entry Analysis */}
          {activeJournal ? (
            <div className="bg-gradient-to-br from-accent-sky/5 via-accent-lavender/5 to-accent-peach/5 p-6 rounded-3xl border border-white shadow-xs text-left space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Sparkles className="text-accent-lavender" size={16} />
                <span>AI Entry Analysis</span>
              </h3>
              
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Emotion Analysis</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeJournal.emotions.map(e => (
                    <span key={e} className="text-[10px] bg-accent-sky/15 text-accent-sky px-2.5 py-0.5 rounded-full font-bold">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Detected Triggers</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeJournal.triggers.map(t => (
                    <span key={t} className="text-[10px] bg-accent-lavender/15 text-accent-lavender px-2.5 py-0.5 rounded-full font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider mb-1">Executive Summary</span>
                <p className="text-xs text-slate-600 leading-relaxed italic bg-white/50 p-3 rounded-xl border border-slate-100/50">
                  "{activeJournal.summary}"
                </p>
              </div>

              {activeJournal.gratitude && (
                <div className="pt-2 border-t border-slate-100/60">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Gratitude Box</span>
                  <p className="text-xs text-slate-600 font-semibold mt-1">❤ {activeJournal.gratitude}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/60 p-6 rounded-3xl border border-white text-xs text-slate-400 text-center">
              Write an entry to activate AI emotional assessments.
            </div>
          )}

          {/* Search Index Panel */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 text-left">Reflections Directory</h3>
            
            <div className="relative mb-4">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search size={14} />
              </span>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search past logs..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-hidden focus:bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 hide-scrollbar">
              {filteredJournals.map(j => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJournalId(j.id)}
                  className={`
                    w-full p-3 rounded-2xl text-left border flex flex-col transition-all
                    ${selectedJournalId === j.id 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100/50'}
                  `}
                >
                  <span className="text-xs font-bold truncate">{j.title}</span>
                  <div className="flex justify-between items-center mt-2 text-[9px] w-full">
                    <span className={selectedJournalId === j.id ? 'text-slate-400' : 'text-slate-400'}>
                      {new Date(j.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    {j.privateMode && <Lock size={10} className="text-amber-500" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
