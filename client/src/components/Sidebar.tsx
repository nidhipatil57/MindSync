import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, MessageSquareHeart, Smile, BookOpen, Moon, CheckCircle2, 
  Clock, ShieldAlert, Zap, Users, Brain, HeartHandshake, BarChart3, Settings, 
  LogOut, Menu, X, Bell
} from 'lucide-react';

interface SidebarProps {
  notificationsCount: number;
  onNotificationsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ notificationsCount, onNotificationsClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Companion', path: '/ai-companion', icon: MessageSquareHeart },
    { name: 'Mood Tracker', path: '/mood-tracker', icon: Smile },
    { name: 'Journal', path: '/journal', icon: BookOpen },
    { name: 'Sleep', path: '/sleep', icon: Moon },
    { name: 'Habits', path: '/habits', icon: CheckCircle2 },
    { name: 'Productivity', path: '/productivity', icon: Clock },
    { name: 'Digital Detox', path: '/digital-detox', icon: ShieldAlert },
    { name: 'Burnout', path: '/burnout', icon: Zap },
    { name: 'Social Confidence', path: '/social-confidence', icon: Brain },
    { name: 'Healing Space', path: '/healing-space', icon: HeartHandshake },
    { name: 'Safe Circle', path: '/safe-circle', icon: Users },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeStyle = "flex items-center px-4 py-3 text-sm font-medium rounded-xl bg-accent-lavender/10 text-accent-lavender border-l-4 border-accent-lavender shadow-xs transition-all";
  const inactiveStyle = "flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200";

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden w-full h-16 flex items-center justify-between px-4 bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-sky to-accent-lavender flex items-center justify-center text-white font-bold">M</div>
          <span className="font-semibold text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">MindSync</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={onNotificationsClick}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
          >
            <Bell size={20} />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent-coral text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {notificationsCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Navigation Overlay for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer & Persistent Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-64 bg-white/80 backdrop-blur-md border-r border-slate-100/60 p-6 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-sky to-accent-lavender flex items-center justify-center text-white font-bold shadow-md shadow-accent-lavender/20">
              <Brain size={18} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">MindSync</span>
          </div>
          <button lg-hidden="true" className="lg:hidden p-1 text-slate-400" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="mb-6 p-3 bg-slate-50/50 rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-accent-sky/20 text-accent-sky font-semibold flex items-center justify-center text-sm border border-accent-sky/10">
            {user?.name?.slice(0, 2).toUpperCase() || 'ME'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Wellness User'}</h4>
            <span className="text-[11px] text-slate-400 capitalize">{user?.occupation || 'Companion'}</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1 -mr-2 hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
              >
                <Icon className="mr-3 shrink-0" size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-500 hover:text-accent-coral hover:bg-red-50 rounded-xl transition-all duration-200"
          >
            <LogOut className="mr-3" size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
