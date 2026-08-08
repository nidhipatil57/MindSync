import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Helper to make sure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return [];
  }
};

const writeData = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${collection}:`, err);
  }
};

// Seed initial demo data if empty
export const seedDatabase = async () => {
  const users = readData('users');
  if (users.length === 0) {
    console.log('Seeding mock data for demo account...');

    // 1. Create Demo User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = {
      id: 'demo-user-id',
      email: 'demo@mindsync.com',
      password: hashedPassword,
      name: 'Nidhi',
      age: 21,
      occupation: 'Student',
      stressLevel: 6, // 1 to 10
      sleepHours: 6.5,
      goals: ['Reduce Anxiety', 'Prevent Burnout', 'Improve focus', 'Sleep before 11 PM'],
      habits: ['Drink Water', 'Workout', 'Meditation', 'Reading'],
      preferredWakeTime: '06:30',
      preferredSleepTime: '22:30',
      workoutFrequency: '3 times/week',
      screenTime: '6.5 hours',
      onboarded: true,
      createdAt: new Date().toISOString()
    };
    writeData('users', [demoUser]);

    // 2. Generate 14 days of Mood Logs
    const moodLogs = [];
    const moods = ['Calm', 'Joyful', 'Anxious', 'Tired', 'Sad', 'Focused', 'Stressed'];
    const reasonsList = [['Work', 'Sleep'], ['Friends', 'Exercise'], ['Studies', 'Deadline'], ['Rest', 'Nature'], ['Routine'], ['Health']];
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Let's create a stress spike 4 days ago
      const isStressSpike = i === 4;
      const mood = isStressSpike ? 'Stressed' : moods[i % moods.length];
      const intensity = isStressSpike ? 9 : (4 + (i % 6));
      const stress = isStressSpike ? 9 : (3 + (i % 5));
      const energy = isStressSpike ? 3 : (5 + (i % 4));
      const productivity = isStressSpike ? 2 : (6 + (i % 5));
      const sleepQuality = isStressSpike ? 40 : (60 + (i % 3) * 10);

      moodLogs.push({
        id: `mood-${i}`,
        userId: 'demo-user-id',
        date: date.toISOString(),
        mood,
        intensity,
        stress,
        energy,
        social: 5 + (i % 4),
        sleepQuality,
        productivity,
        notes: isStressSpike ? 'Extremely overwhelmed by the upcoming midterms and late night studies.' : 'Feeling okay, keeping up with the routine.',
        reasons: isStressSpike ? ['Studies', 'Sleep'] : reasonsList[i % reasonsList.length]
      });
    }
    writeData('moodLogs', moodLogs);

    // 3. Generate Journal Entries
    const journalEntries = [
      {
        id: 'journal-1',
        userId: 'demo-user-id',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        title: 'Overcoming the Midterm Stress',
        content: 'I have been feeling really exhausted lately. The exam pressure is building up and I spent the whole night study session typing away on the computer. I felt highly stressed but after writing this down, I feel slightly better. I need to take a break.',
        privateMode: false,
        gratitude: 'Grateful for Aarav who brought me a hot coffee late night.',
        reflection: 'I should plan my revision schedule better so I do not have to pull all-nighters.',
        summary: 'Felt exhausted due to exam preparation and late night study. Writing it down helped manage the stress.',
        emotions: ['Exhausted', 'Anxious', 'Determined'],
        triggers: ['Exam pressure', 'Lack of sleep', 'Coffee']
      },
      {
        id: 'journal-2',
        userId: 'demo-user-id',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        title: 'A Calmer Morning Walk',
        content: 'Woke up early today and went for a walk in the park. The air was cool and crisp. I sat near the pond for 10 minutes just listening to the birds. It felt incredibly healing. Productivity was great today.',
        privateMode: false,
        gratitude: 'Grateful for the beautiful nature and sunny skies.',
        reflection: 'I need to make morning walks a consistent part of my routine.',
        summary: 'Had a peaceful morning walk in the park which improved mood and boosted daily productivity.',
        emotions: ['Calm', 'Peaceful', 'Joyful'],
        triggers: ['Morning walk', 'Nature', 'Quiet time']
      }
    ];
    writeData('journalEntries', journalEntries);

    // 4. Generate Habits
    const habits = [
      {
        id: 'habit-1',
        userId: 'demo-user-id',
        name: 'Drink Water',
        target: '2 Liters',
        frequency: 'Daily',
        streak: 5,
        history: {}, // { 'YYYY-MM-DD': true }
        createdAt: new Date().toISOString()
      },
      {
        id: 'habit-2',
        userId: 'demo-user-id',
        name: 'Workout',
        target: '30 mins',
        frequency: 'Daily',
        streak: 2,
        history: {},
        createdAt: new Date().toISOString()
      },
      {
        id: 'habit-3',
        userId: 'demo-user-id',
        name: 'Meditation',
        target: '10 mins',
        frequency: 'Daily',
        streak: 4,
        history: {},
        createdAt: new Date().toISOString()
      },
      {
        id: 'habit-4',
        userId: 'demo-user-id',
        name: 'Reading',
        target: '10 pages',
        frequency: 'Daily',
        streak: 1,
        history: {},
        createdAt: new Date().toISOString()
      }
    ];
    // Fill history for the last 5 days
    const todayStr = new Date().toISOString().split('T')[0];
    for (let i = 1; i <= 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      habits[0].history[dStr] = true; // Drink water complete
      if (i <= 2) habits[1].history[dStr] = true; // Workout complete
      if (i <= 4) habits[2].history[dStr] = true; // Meditate complete
      if (i <= 1) habits[3].history[dStr] = true; // Read complete
    }
    writeData('habits', habits);

    // 5. Generate Tasks
    const tasks = [
      { id: 'task-1', userId: 'demo-user-id', title: '20-minute morning walk', completed: true, date: todayStr, category: 'Health' },
      { id: 'task-2', userId: 'demo-user-id', title: 'Drink 2L water', completed: true, date: todayStr, category: 'Habit' },
      { id: 'task-3', userId: 'demo-user-id', title: 'One Pomodoro focus session', completed: false, date: todayStr, category: 'Productivity' },
      { id: 'task-4', userId: 'demo-user-id', title: 'Sleep before 11 PM', completed: false, date: todayStr, category: 'Sleep' },
      { id: 'task-5', userId: 'demo-user-id', title: 'Complete assignment draft', completed: false, date: todayStr, category: 'Studies' },
      { id: 'task-6', userId: 'demo-user-id', title: 'Read 10 pages of book', completed: true, date: todayStr, category: 'Habit' }
    ];
    writeData('tasks', tasks);

    // 6. Generate Sleep Logs (last 7 nights)
    const sleepData = [];
    const sleepOffsets = [
      { sleep: 6.5, bedtime: '23:45', wake: '06:15', quality: 65 },
      { sleep: 7.0, bedtime: '23:00', wake: '06:00', quality: 75 },
      { sleep: 5.5, bedtime: '00:30', wake: '06:00', quality: 50 }, // Stress night
      { sleep: 8.0, bedtime: '22:30', wake: '06:30', quality: 90 },
      { sleep: 6.0, bedtime: '23:30', wake: '05:30', quality: 70 },
      { sleep: 6.8, bedtime: '23:15', wake: '06:03', quality: 78 },
      { sleep: 7.2, bedtime: '22:45', wake: '06:00', quality: 82 }
    ];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const offset = sleepOffsets[i % sleepOffsets.length];
      sleepData.push({
        id: `sleep-${i}`,
        userId: 'demo-user-id',
        date: date.toISOString().split('T')[0],
        duration: offset.sleep,
        bedtime: offset.bedtime,
        wakeTime: offset.wake,
        quality: offset.quality,
        sleepDebt: Math.max(0, 8 - offset.sleep)
      });
    }
    writeData('sleepData', sleepData);

    // 7. Safe Circle Contacts
    const safeCircle = [
      { id: 'contact-1', userId: 'demo-user-id', name: 'Aarav (Brother)', phone: '+1234567890', email: 'aarav@example.com', relation: 'Family' },
      { id: 'contact-2', userId: 'demo-user-id', name: 'Priya (Best Friend)', phone: '+0987654321', email: 'priya@example.com', relation: 'Friend' }
    ];
    writeData('safeCircle', safeCircle);

    // 8. Notifications
    const notifications = [
      { id: 'notif-1', userId: 'demo-user-id', text: 'Time to drink water! Grab a fresh glass.', read: false, createdAt: new Date().toISOString() },
      { id: 'notif-2', userId: 'demo-user-id', text: 'Take a deep breath. Inhale for 4s, hold for 4s, exhale for 4s.', read: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { id: 'notif-3', userId: 'demo-user-id', text: 'Focus session completed. Rest your eyes for 5 minutes!', read: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ];
    writeData('notifications', notifications);

    // 9. Conversations
    const conversations = [
      {
        id: 'chat-1',
        userId: 'demo-user-id',
        role: 'model',
        text: 'Hello Nidhi! I am your MindSync AI Companion. How can I help you support your wellness journey today?',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ];
    writeData('conversations', conversations);

    console.log('Seeding complete.');
  }
};

// Database Query APIs
export const db = {
  find: (collection, query = {}) => {
    const list = readData(collection);
    return list.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },

  findOne: (collection, query = {}) => {
    const list = readData(collection);
    return list.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  },

  insert: (collection, item) => {
    const list = readData(collection);
    const newItem = { id: `${collection.slice(0, 4)}-${Date.now()}-${Math.floor(Math.random()*1000)}`, ...item };
    list.push(newItem);
    writeData(collection, list);
    return newItem;
  },

  update: (collection, query, updates) => {
    const list = readData(collection);
    let updatedItem = null;
    const newList = list.map(item => {
      let matches = true;
      for (let key in query) {
        if (item[key] !== query[key]) matches = false;
      }
      if (matches) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });
    writeData(collection, newList);
    return updatedItem;
  },

  delete: (collection, query) => {
    const list = readData(collection);
    const newList = list.filter(item => {
      let matches = true;
      for (let key in query) {
        if (item[key] !== query[key]) matches = false;
      }
      return !matches;
    });
    writeData(collection, newList);
    return true;
  }
};
