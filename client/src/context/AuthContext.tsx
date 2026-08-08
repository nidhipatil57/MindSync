import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  occupation?: string;
  stressLevel?: number;
  sleepHours?: number;
  goals?: string[];
  habits?: string[];
  preferredWakeTime?: string;
  preferredSleepTime?: string;
  workoutFrequency?: string;
  screenTime?: string;
  onboarded: boolean;
  wellnessScore?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  submitOnboarding: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/api/auth/profile');
      setUser(data);
    } catch (err) {
      // Token expired or invalid
      localStorage.removeItem('mindsync_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('mindsync_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('mindsync_token', data.token);
      await fetchProfile();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/api/auth/signup', { name, email, password });
      localStorage.setItem('mindsync_token', data.token);
      await fetchProfile();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('mindsync_token');
    setUser(null);
  };

  const submitOnboarding = async (data: Partial<User>) => {
    try {
      const response = await api.post('/api/auth/onboard', data);
      setUser(response.user);
    } catch (err) {
      throw err;
    }
  };

  const refreshProfile = async () => {
    try {
      const data = await api.get('/api/auth/profile');
      setUser(data);
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, submitOnboarding, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
