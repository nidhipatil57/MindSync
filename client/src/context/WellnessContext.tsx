import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface MoodLog {
  id: string;
  mood: string;
  intensity: number;
  stress: number;
  energy: number;
  social: number;
  sleepQuality: number;
  productivity: number;
  notes: string;
  reasons: string[];
  date: string;
}

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  privateMode: boolean;
  gratitude: string;
  reflection: string;
  summary: string;
  emotions: string[];
  triggers: string[];
}

interface Habit {
  id: string;
  name: string;
  target: string;
  frequency: string;
  streak: number;
  history: Record<string, boolean>;
}

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  date: string;
}

interface SleepLog {
  id: string;
  date: string;
  duration: number;
  bedtime: string;
  wakeTime: string;
  quality: number;
  sleepDebt: number;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

interface Notification {
  id: string;
  text: string;
  read: boolean;
  createdAt: string;
}

interface BurnoutInfo {
  score: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reasons: string[];
  recoveryPlan: string[];
  weeklySuggestions: string[];
}

interface WellnessContextType {
  moods: MoodLog[];
  journals: JournalEntry[];
  habits: Habit[];
  tasks: Task[];
  sleep: SleepLog[];
  contacts: Contact[];
  notifications: Notification[];
  burnout: BurnoutInfo | null;
  coachBriefing: string;
  loading: boolean;
  refreshAll: () => Promise<void>;
  addMood: (moodData: Partial<MoodLog>) => Promise<void>;
  addJournal: (journalData: Partial<JournalEntry>) => Promise<JournalEntry>;
  addHabit: (name: string, target: string, frequency: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  addTask: (title: string, category?: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addSleep: (sleepData: Partial<SleepLog>) => Promise<void>;
  addContact: (contactData: Partial<Contact>) => Promise<void>;
  triggerSOS: () => Promise<void>;
  markNotificationsRead: () => void;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshProfile } = useAuth();
  const [moods, setMoods] = useState<MoodLog[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sleep, setSleep] = useState<SleepLog[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [burnout, setBurnout] = useState<BurnoutInfo | null>(null);
  const [coachBriefing, setCoachBriefing] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const refreshAll = async () => {
    if (!user) return;
    setLoading(true);
    try {
            const [moodList, journalList, habitList, taskList, sleepList, contactList, burnoutData, coachData] = await Promise.all([
        api.get('/api/moods'),
        api.get('/api/journals'),
        api.get('/api/habits'),
        api.get('/api/tasks'),
        api.get('/api/sleep'),
        api.get('/api/circle'),
        api.get('/api/burnout'),
        api.get('/api/coach/briefing')
      ]);

      setMoods(moodList);
      setJournals(journalList);
      setHabits(habitList);
      setTasks(taskList);
      setSleep(sleepList);
      setContacts(contactList);
      setBurnout(burnoutData || null);
      setCoachBriefing(coachData?.briefing || '');
      
      // Let's mock notifications list since we didn't add a router for notifications (we can just add it to Express or pull it from a simple client fetch fallback).
      // Wait, we can fetch notifications by adding a simple endpoint, or we can just mock them on the client since they are soft notices anyway!
      // Let's mock notifications on the client, or write a local state. Let's use local state for notifications to keep it super fast.
      if (notifications.length === 0) {
        setNotifications([
          { id: 'notif-1', text: 'Time to drink water! Grab a fresh glass.', read: false, createdAt: new Date().toISOString() },
          { id: 'notif-2', text: 'Take a deep breath. Inhale for 4s, hold for 4s, exhale for 4s.', read: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
          { id: 'notif-3', text: 'Focus session completed. Rest your eyes for 5 minutes!', read: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
        ]);
      }
    } catch (err) {
      console.error('Error fetching wellness data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshAll();
    }
  }, [user]);

  const addMood = async (moodData: Partial<MoodLog>) => {
    try {
      const newMood = await api.post('/api/moods', moodData);
      setMoods(prev => [...prev, newMood]);
      await refreshProfile(); // Refresh profile to get updated wellness score
      await refreshAll();     // Update burnout risk etc
    } catch (err) {
      console.error(err);
    }
  };

  const addJournal = async (journalData: Partial<JournalEntry>): Promise<JournalEntry> => {
    try {
      const entry = await api.post('/api/journals', journalData);
      setJournals(prev => [...prev, entry]);
      await refreshAll();
      return entry;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const addHabit = async (name: string, target: string, frequency: string) => {
    try {
      const newHabit = await api.post('/api/habits', { name, target, frequency });
      setHabits(prev => [...prev, newHabit]);
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      const updated = await api.post(`/api/habits/${id}/toggle`, {});
      setHabits(prev => prev.map(h => h.id === id ? updated : h));
      await refreshProfile();
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      await api.delete(`/api/habits/${id}`);
      setHabits(prev => prev.filter(h => h.id !== id));
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (title: string, category?: string) => {
    try {
      const newTask = await api.post('/api/tasks', { title, category });
      setTasks(prev => [...prev, newTask]);
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      const updated = await api.put(`/api/tasks/${id}/toggle`);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      await refreshProfile();
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addSleep = async (sleepData: Partial<SleepLog>) => {
    try {
      const log = await api.post('/api/sleep', sleepData);
      setSleep(prev => [...prev, log]);
      await refreshProfile();
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addContact = async (contactData: Partial<Contact>) => {
    try {
      const contact = await api.post('/api/circle', contactData);
      setContacts(prev => [...prev, contact]);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerSOS = async () => {
    try {
      await api.post('/api/circle/sos', {});
      // Add a client notification alert
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        text: `🚨 SOS triggered! Simulated alerts have been dispatched to your contacts: ${contacts.map(c => c.name).join(', ')}.`,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <WellnessContext.Provider value={{
      moods, journals, habits, tasks, sleep, contacts, notifications, burnout, coachBriefing, loading,
      refreshAll, addMood, addJournal, addHabit, toggleHabit, deleteHabit, addTask, toggleTask, deleteTask, addSleep, addContact, triggerSOS, markNotificationsRead
    }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (context === undefined) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};
