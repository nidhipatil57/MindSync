import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Heart, Shield, CheckCircle, HelpCircle } from 'lucide-react';
import { BackgroundBlobs } from '../components/BackgroundBlobs';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: "Is MindSync a therapist replacement?", a: "No, MindSync is a preventive wellness companion designed to support daily habits, monitor stress, and offer emotional exercises. For clinical concerns, please consult a professional." },
    { q: "How does burnout prediction work?", a: "Our system correlates your sleep logs, screen-time habits, completed tasks, and mood trends to calculate an intelligent burnout risk index before exhaustion sets in." },
    { q: "Where is my data stored?", a: "Your logs are stored locally within your secure account sandbox, adhering to industry-standard privacy guidelines." }
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between overflow-x-hidden">
      <BackgroundBlobs />
      
      {/* Top Navbar */}
      <nav className="w-full max-w-7xl h-20 flex items-center justify-between px-6 md:px-12 sticky top-0 z-30 bg-white/30 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-sky to-accent-lavender flex items-center justify-center text-white font-bold shadow-md shadow-accent-lavender/20">
            <Brain size={18} />
          </div>
          <span className="font-bold text-xl text-slate-800">MindSync</span>
        </div>
        <button 
          onClick={() => navigate('/login')} 
          className="px-6 py-2 rounded-xl text-sm font-semibold text-accent-lavender bg-white border border-accent-lavender/10 shadow-xs hover:bg-slate-50 transition-all duration-200"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="w-full max-w-7xl flex flex-col items-center px-6 md:px-12 text-center mt-12 md:mt-20">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-accent-lavender/10 text-accent-lavender rounded-full text-xs font-semibold mb-6 animate-pulse">
          <Sparkles size={14} />
          <span>Buildathon 2026 Winner MVP</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight max-w-4xl font-sans">
          One Intelligent Ecosystem for <br />
          <span className="bg-gradient-to-r from-accent-sky via-accent-lavender to-accent-peach bg-clip-text text-transparent">
            Your Mental Wellness & Productivity
          </span>
        </h1>
        
        <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
          MindSync connects sleep intelligence, mood tracking, smart journaling, productivity planning, and social roleplay training into one calming wellness companion.
        </p>

        {/* Hero CTA */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button 
            onClick={() => navigate('/signup')} 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent-sky to-accent-lavender text-white font-semibold rounded-2xl shadow-lg shadow-accent-lavender/25 hover:opacity-95 transform active:scale-95 transition-all duration-200"
          >
            Start Free Onboarding
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full sm:w-auto px-8 py-4 bg-white/80 text-slate-700 font-semibold rounded-2xl border border-slate-200/60 shadow-xs hover:bg-white transition-all transform active:scale-95 duration-200"
          >
            Try Demo Account
          </button>
        </div>

        {/* Calming Dashboard Mockup Graphic */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white/40 backdrop-blur-md p-3 md:p-6 transition-all duration-300 hover:shadow-accent-sky/10">
          <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex flex-col">
            {/* Mock Dashboard Topbar */}
            <div className="h-10 border-b border-slate-100 bg-white/90 flex items-center px-4 justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-[11px] text-slate-400 font-medium">mindsync.wellness/dashboard</div>
              <div className="w-6 h-6 rounded-full bg-slate-200" />
            </div>
            {/* Mock Dashboard Preview */}
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100/60">
                <span className="text-xs text-slate-400 font-semibold uppercase">Wellness Index</span>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">78 / 100</h3>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-accent-sky h-full rounded-full w-[78%]" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100/60">
                <span className="text-xs text-slate-400 font-semibold uppercase">Mood State</span>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">Calm & Focused</h3>
                <p className="text-xs text-accent-mint font-semibold mt-2">↑ 5% stability since yesterday</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100/60">
                <span className="text-xs text-slate-400 font-semibold uppercase">Burnout Risk</span>
                <h3 className="text-2xl font-bold mt-1 text-slate-800">Medium (45%)</h3>
                <p className="text-xs text-slate-500 mt-2">Take a stretch break</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-28 w-full">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Crafted for Emotional Safety & Calm</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">No flashing metrics or gamified stressors. Just organic layouts and encouraging feedback.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 bg-accent-sky/15 text-accent-sky rounded-2xl flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">AI Companion</h3>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">Chat naturally to offload stress, request guided mindfulness, or receive study tips tailored to your daily state.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 bg-accent-lavender/15 text-accent-lavender rounded-2xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Burnout Forecasts</h3>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">Tracks indicators across all modules to proactively alert you of mental overload and output structured recovery guides.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xs flex flex-col items-center">
              <div className="w-12 h-12 bg-accent-mint/15 text-accent-mint rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Unified Analytics</h3>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">No disjointed trackers. Everything works together to show you how sleep levels correlate with daily focus.</p>
            </div>
          </div>
        </section>

        {/* Pricing Plan Preview */}
        <section className="mt-28 w-full max-w-4xl bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-8 md:p-12 shadow-xs">
          <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Pricing</span>
          <h2 className="text-3xl font-extrabold text-slate-800 mt-2">MindSync is Currently in Beta</h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto">Get full unlimited access during our Buildathon launch. No payment required.</p>
          <div className="mt-8 flex justify-center items-baseline space-x-1">
            <span className="text-5xl font-extrabold text-slate-900">$0</span>
            <span className="text-slate-400">/ forever (during beta)</span>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-28 w-full max-w-3xl text-left">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xs">
                <h4 className="font-bold text-slate-800 flex items-start">
                  <HelpCircle size={18} className="text-accent-lavender mr-3 mt-0.5 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-slate-500 text-sm mt-2 ml-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 py-10 mt-32 text-center text-xs text-slate-400 bg-white/10 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-accent-sky to-accent-lavender flex items-center justify-center text-white text-xs font-bold">M</div>
            <span className="font-semibold text-slate-700">MindSync</span>
          </div>
          <p>© 2026 MindSync. Built for Buildathon 2026. All rights reserved.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
