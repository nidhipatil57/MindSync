import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages';
import { OnboardingPage } from './pages/OnboardingPage';
import { Dashboard } from './pages/Dashboard';
import { AICompanion } from './pages/AICompanion';
import { MoodTracker } from './pages/MoodTracker';
import { SmartJournal } from './pages/SmartJournal';
import { SleepIntelligence } from './pages/SleepIntelligence';
import { HabitBuilder } from './pages/HabitBuilder';
import { BurnoutPrediction } from './pages/BurnoutPrediction';
import { ProductivityCoach } from './pages/ProductivityCoach';
import { DigitalDetox } from './pages/DigitalDetox';
import { SocialConfidence } from './pages/SocialConfidence';
import { HealingSpace } from './pages/HealingSpace';
import { SafeCircle } from './pages/SafeCircle';
import { InsightsDashboard } from './pages/InsightsDashboard';
import { SettingsPage } from './pages/SettingsPage';
import { Bell, X, Info } from 'lucide-react';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
        Authenticating wellness session...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to Onboarding if they logged in but haven't finished survey
  const location = useLocation();
  if (!user.onboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Main Layout Wrapper
const AppLayout: React.FC = () => {
  const { notifications, markNotificationsRead } = useWellness();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const isLandingOrAuth = ['/', '/login', '/signup', '/forgot-password', '/onboarding'].includes(location.pathname);
  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLandingOrAuth) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative">
      <BackgroundBlobs />
      
      {/* Persistent Left Sidebar */}
      <Sidebar 
        notificationsCount={unreadCount} 
        onNotificationsClick={() => setShowNotifications(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen flex flex-col relative">
        
        {/* Desktop Navbar Bell Trigger */}
        <div className="hidden lg:flex justify-end p-6 max-w-7xl w-full mx-auto pb-0">
          <button 
            onClick={() => setShowNotifications(true)}
            className="p-3 bg-white/60 hover:bg-white border border-slate-100/60 rounded-2xl relative shadow-xs transition-all hover:scale-105 duration-200"
          >
            <Bell size={18} className="text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-accent-coral text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/ai-companion" element={<ProtectedRoute><AICompanion /></ProtectedRoute>} />
          <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><SmartJournal /></ProtectedRoute>} />
          <Route path="/sleep" element={<ProtectedRoute><SleepIntelligence /></ProtectedRoute>} />
          <Route path="/habits" element={<ProtectedRoute><HabitBuilder /></ProtectedRoute>} />
          <Route path="/productivity" element={<ProtectedRoute><ProductivityCoach /></ProtectedRoute>} />
          <Route path="/digital-detox" element={<ProtectedRoute><DigitalDetox /></ProtectedRoute>} />
          <Route path="/burnout" element={<ProtectedRoute><BurnoutPrediction /></ProtectedRoute>} />
          <Route path="/social-confidence" element={<ProtectedRoute><SocialConfidence /></ProtectedRoute>} />
          <Route path="/healing-space" element={<ProtectedRoute><HealingSpace /></ProtectedRoute>} />
          <Route path="/safe-circle" element={<ProtectedRoute><SafeCircle /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><InsightsDashboard /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Soft Notification Center Drawer overlay */}
      {showNotifications && (
        <>
          <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-50" onClick={() => setShowNotifications(false)} />
          <aside className="fixed right-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md border-l border-slate-100 p-6 flex flex-col justify-between z-50 animate-slide-in">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                  <Bell size={16} className="text-accent-lavender" />
                  <span>Notification Center</span>
                </h3>
                <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[450px] overflow-y-auto pr-1 hide-scrollbar text-left">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start space-x-2.5 transition-all
                      ${n.read ? 'bg-slate-50/50 border-slate-100 text-slate-400' : 'bg-accent-sky/5 border-accent-sky/20 text-slate-700 font-medium'}
                    `}
                  >
                    <Info size={14} className="shrink-0 mt-0.5 text-accent-sky" />
                    <span>{n.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                markNotificationsRead();
                setShowNotifications(false);
              }}
              className="w-full py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 shadow-xs mt-6"
            >
              Mark all as read
            </button>
          </aside>
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <WellnessProvider>
          <AppLayout />
        </WellnessProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
