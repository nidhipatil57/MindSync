import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { BackgroundBlobs } from '../components/BackgroundBlobs';

// ==========================================
// LOGIN PAGE
// ==========================================
export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoCredentials = async () => {
    setError('');
    setLoading(true);
    try {
      await login('demo@mindsync.com', 'password123');
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to log in with demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <BackgroundBlobs />
      <div className="w-full max-w-md bg-white/75 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-accent-sky to-accent-lavender rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-accent-lavender/25 mb-4">
            <Brain size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome to MindSync</h2>
          <p className="text-slate-400 text-sm mt-1">Nurturing your focus and emotional well-being</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 flex items-start space-x-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-accent-lavender hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input 
              id="remember_me" 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-accent-sky focus:ring-accent-sky"
            />
            <label htmlFor="remember_me" className="ml-2 text-xs text-slate-500">Remember my session</label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-accent-sky to-accent-lavender text-white font-semibold rounded-xl hover:opacity-95 transition-all text-sm shadow-md shadow-accent-lavender/10 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="my-6 flex items-center justify-between">
          <hr className="w-full border-slate-100" />
          <span className="text-[11px] text-slate-400 px-3 uppercase shrink-0 font-bold tracking-wider">Demo</span>
          <hr className="w-full border-slate-100" />
        </div>

        <div className="space-y-3">
          <button 
            onClick={loadDemoCredentials}
            disabled={loading}
            className="w-full py-3.5 bg-accent-sky/10 border border-accent-sky/15 text-accent-sky font-semibold rounded-xl text-sm hover:bg-accent-sky/15 transition-all flex items-center justify-center"
          >
            Enter Demo Workspace
          </button>
          

        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/signup')} 
            className="text-accent-lavender font-semibold hover:underline"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// SIGNUP PAGE
// ==========================================
export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password);
      // New users go to onboarding flow
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <BackgroundBlobs />
      <div className="w-full max-w-md bg-white/75 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-accent-sky to-accent-lavender rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-accent-lavender/25 mb-4">
            <Brain size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Start your journey to mental clarity</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 flex items-start space-x-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <User size={16} />
              </span>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nidhi Patil"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-accent-sky to-accent-lavender text-white font-semibold rounded-xl hover:opacity-95 transition-all text-sm shadow-md shadow-accent-lavender/10 flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Onboarding'}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-accent-lavender font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// FORGOT PASSWORD PAGE
// ==========================================
export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <BackgroundBlobs />
      <div className="w-full max-w-md bg-white/75 backdrop-blur-md rounded-3xl border border-white/60 p-8 shadow-xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-accent-sky to-accent-lavender rounded-2xl flex items-center justify-center text-white font-bold shadow-md shadow-accent-lavender/25 mb-4">
            <Brain size={22} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Reset Password</h2>
          <p className="text-slate-400 text-sm mt-1">We will send you a recovery link</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-600">
              Recovery email has been simulated and sent to <strong>{email}</strong>.
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-200 transition-all"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-hidden focus:border-accent-sky focus:ring-1 focus:ring-accent-sky/20 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 bg-gradient-to-r from-accent-sky to-accent-lavender text-white font-semibold rounded-xl hover:opacity-95 transition-all text-sm shadow-md"
            >
              Send Reset Link
            </button>

            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-center text-xs text-slate-500 hover:underline font-medium"
            >
              Cancel and go back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
