import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../services/db.js';
import { aiService } from '../services/ai.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mindsync-super-secret-key-2026';

// Helper: Calculate Wellness Score
const calculateWellnessScore = (userId) => {
  const moods = db.find('moodLogs', { userId });
  const habits = db.find('habits', { userId });
  const sleep = db.find('sleepData', { userId });
  const tasks = db.find('tasks', { userId });

  let score = 75; // Baseline

  // 1. Mood contribution (max +10, min -15)
  if (moods.length > 0) {
    const recentMoods = moods.slice(-5);
    const avgStress = recentMoods.reduce((acc, curr) => acc + curr.stress, 0) / recentMoods.length;
    const avgEnergy = recentMoods.reduce((acc, curr) => acc + curr.energy, 0) / recentMoods.length;
    
    if (avgStress > 7) score -= 12;
    else if (avgStress < 4) score += 5;

    if (avgEnergy > 7) score += 5;
    else if (avgEnergy < 4) score -= 5;
  }

  // 2. Habits contribution (up to +10)
  if (habits.length > 0) {
    const totalStreaks = habits.reduce((acc, h) => acc + (h.streak || 0), 0);
    score += Math.min(10, Math.floor(totalStreaks / 2));
  }

  // 3. Sleep contribution (max +5, min -10)
  if (sleep.length > 0) {
    const recentSleep = sleep.slice(-3);
    const avgSleep = recentSleep.reduce((acc, curr) => acc + curr.duration, 0) / recentSleep.length;
    if (avgSleep < 6) score -= 10;
    else if (avgSleep >= 7 && avgSleep <= 9) score += 5;
  }

  // 4. Tasks contribution (up to +5)
  if (tasks.length > 0) {
    const completedTasks = tasks.filter(t => t.completed).length;
    score += Math.min(5, completedTasks);
  }

  return Math.max(20, Math.min(100, score));
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Signup
router.post('/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  const existing = db.findOne('users', { email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists with this email.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = db.insert('users', {
    email,
    password: hashedPassword,
    name,
    age: 22,
    occupation: 'Student',
    stressLevel: 5,
    sleepHours: 7,
    goals: ['Reduce Stress'],
    habits: ['Drink Water'],
    preferredWakeTime: '07:00',
    preferredSleepTime: '23:00',
    workoutFrequency: '1-2 times/week',
    screenTime: '5 hours',
    onboarded: false,
    createdAt: new Date().toISOString()
  });

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      onboarded: newUser.onboarded
    }
  });
});

// Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.findOne('users', { email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      onboarded: user.onboarded
    }
  });
});

// Get Profile
router.get('/auth/profile', authMiddleware, (req, res) => {
  const user = db.findOne('users', { id: req.user.id });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const { password, ...safeUser } = user;
  const wellnessScore = calculateWellnessScore(req.user.id);
  res.json({ ...safeUser, wellnessScore });
});

// Submit Onboarding
router.post('/auth/onboard', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const updates = {
    ...req.body,
    onboarded: true
  };

  const updatedUser = db.update('users', { id: userId }, updates);
  if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

  const { password, ...safeUser } = updatedUser;
  res.json({ message: 'Onboarding completed successfully!', user: safeUser });
});

// ==========================================
// MOOD TRACKER ROUTES
// ==========================================
router.get('/moods', authMiddleware, (req, res) => {
  const logs = db.find('moodLogs', { userId: req.user.id });
  res.json(logs);
});

router.post('/moods', authMiddleware, (req, res) => {
  const { mood, intensity, stress, energy, social, sleepQuality, productivity, notes, reasons } = req.body;
  if (!mood || !intensity) {
    return res.status(400).json({ message: 'Mood and intensity are required.' });
  }

  const newLog = db.insert('moodLogs', {
    userId: req.user.id,
    date: new Date().toISOString(),
    mood,
    intensity: parseInt(intensity),
    stress: parseInt(stress || 5),
    energy: parseInt(energy || 5),
    social: parseInt(social || 5),
    sleepQuality: parseInt(sleepQuality || 70),
    productivity: parseInt(productivity || 5),
    notes: notes || '',
    reasons: reasons || []
  });

  res.status(201).json(newLog);
});

// ==========================================
// SMART JOURNAL ROUTES
// ==========================================
router.get('/journals', authMiddleware, (req, res) => {
  const entries = db.find('journalEntries', { userId: req.user.id });
  res.json(entries);
});

router.post('/journals', authMiddleware, async (req, res) => {
  const { title, content, privateMode, gratitude, reflection } = req.body;
  if (!content) return res.status(400).json({ message: 'Journal content is required.' });

  // Call AI Service to get summaries, sentiment/emotions, and triggers
  const analysis = await aiService.analyzeJournalEntry(content);

  const entry = db.insert('journalEntries', {
    userId: req.user.id,
    date: new Date().toISOString(),
    title: title || 'Untitled Entry',
    content,
    privateMode: !!privateMode,
    gratitude: gratitude || '',
    reflection: reflection || '',
    summary: analysis.summary,
    emotions: analysis.emotions,
    triggers: analysis.triggers
  });

  res.status(201).json(entry);
});

// ==========================================
// SLEEP LOGS
// ==========================================
router.get('/sleep', authMiddleware, (req, res) => {
  const logs = db.find('sleepData', { userId: req.user.id });
  res.json(logs);
});

router.post('/sleep', authMiddleware, (req, res) => {
  const { duration, bedtime, wakeTime, quality } = req.body;
  if (!duration || !quality) {
    return res.status(400).json({ message: 'Duration and quality are required.' });
  }

  const newSleep = db.insert('sleepData', {
    userId: req.user.id,
    date: new Date().toISOString().split('T')[0],
    duration: parseFloat(duration),
    bedtime: bedtime || '23:00',
    wakeTime: wakeTime || '07:00',
    quality: parseInt(quality),
    sleepDebt: Math.max(0, 8 - parseFloat(duration))
  });

  res.status(201).json(newSleep);
});

// ==========================================
// HEALTHY HABIT BUILDER
// ==========================================
router.get('/habits', authMiddleware, (req, res) => {
  const habits = db.find('habits', { userId: req.user.id });
  res.json(habits);
});

router.post('/habits', authMiddleware, (req, res) => {
  const { name, target, frequency } = req.body;
  if (!name) return res.status(400).json({ message: 'Habit name is required.' });

  const newHabit = db.insert('habits', {
    userId: req.user.id,
    name,
    target: target || 'Once',
    frequency: frequency || 'Daily',
    streak: 0,
    history: {},
    createdAt: new Date().toISOString()
  });

  res.status(201).json(newHabit);
});

router.post('/habits/:id/toggle', authMiddleware, (req, res) => {
  const { date } = req.body;
  const dateKey = date || new Date().toISOString().split('T')[0];
  const habit = db.findOne('habits', { id: req.params.id, userId: req.user.id });
  
  if (!habit) return res.status(404).json({ message: 'Habit not found.' });

  const history = { ...habit.history };
  let newStreak = habit.streak;

  if (history[dateKey]) {
    delete history[dateKey];
    newStreak = Math.max(0, newStreak - 1);
  } else {
    history[dateKey] = true;
    newStreak += 1;
  }

  const updated = db.update('habits', { id: req.params.id }, { history, streak: newStreak });
  res.json(updated);
});

router.delete('/habits/:id', authMiddleware, (req, res) => {
  const habit = db.findOne('habits', { id: req.params.id, userId: req.user.id });
  if (!habit) return res.status(404).json({ message: 'Habit not found.' });

  db.delete('habits', { id: req.params.id });
  res.json({ message: 'Habit deleted.' });
});

// ==========================================
// TASKS (PRODUCTIVITY PLANNER)
// ==========================================
router.get('/tasks', authMiddleware, (req, res) => {
  const tasks = db.find('tasks', { userId: req.user.id });
  res.json(tasks);
});

router.post('/tasks', authMiddleware, (req, res) => {
  const { title, category, date } = req.body;
  if (!title) return res.status(400).json({ message: 'Task title is required.' });

  const todayStr = new Date().toISOString().split('T')[0];
  const newTask = db.insert('tasks', {
    userId: req.user.id,
    title,
    category: category || 'General',
    completed: false,
    date: date || todayStr
  });

  res.status(201).json(newTask);
});

router.put('/tasks/:id/toggle', authMiddleware, (req, res) => {
  const task = db.findOne('tasks', { id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });

  const updated = db.update('tasks', { id: req.params.id }, { completed: !task.completed });
  res.json(updated);
});

router.delete('/tasks/:id', authMiddleware, (req, res) => {
  const task = db.findOne('tasks', { id: req.params.id, userId: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found.' });

  db.delete('tasks', { id: req.params.id });
  res.json({ message: 'Task deleted successfully.' });
});

// ==========================================
// BURNOUT PREDICTION
// ==========================================
router.get('/burnout', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const user = db.findOne('users', { id: userId });
  const moods = db.find('moodLogs', { userId });
  const sleep = db.find('sleepData', { userId });
  const tasks = db.find('tasks', { userId });

  // Burnout Score Calculation Algorithm
  let baseScore = 30; // base risk index

  // 1. Stress & Mood factor
  if (moods.length > 0) {
    const recent = moods.slice(-7);
    const avgStress = recent.reduce((sum, item) => sum + item.stress, 0) / recent.length;
    baseScore += (avgStress * 4.5); // up to +45
  } else if (user) {
    baseScore += (user.stressLevel * 4);
  }

  // 2. Sleep factor
  if (sleep.length > 0) {
    const recentSleep = sleep.slice(-5);
    const avgSleep = recentSleep.reduce((sum, item) => sum + item.duration, 0) / recentSleep.length;
    if (avgSleep < 6) baseScore += 15;
    else if (avgSleep < 7) baseScore += 8;
    else if (avgSleep > 9) baseScore += 5; // oversleeping
  }

  // 3. Screen Time factor
  if (user) {
    const hrs = parseFloat(user.screenTime);
    if (hrs > 8) baseScore += 20;
    else if (hrs > 6) baseScore += 10;
  }

  // 4. Task load factor (outstanding tasks)
  const outstanding = tasks.filter(t => !t.completed).length;
  baseScore += Math.min(10, outstanding * 2);

  const finalScore = Math.max(10, Math.min(95, Math.round(baseScore)));
  let riskLevel = 'Low';
  let recoveryPlan = [
    'Schedule a 30-minute block of work-free time during lunch.',
    'Hydrate: Drink at least 2L of water today.',
    'Spend 5 minutes doing breathing exercises before sleep.'
  ];
  let reasons = ['Stress levels are stable', 'Sleep cycles are regular'];

  if (finalScore > 70) {
    riskLevel = 'High';
    reasons = [
      'High screen time is causing mental exhaustion.',
      'Sleep average is below 6 hours, creating a high sleep debt.',
      'Recent mood logs indicate persistent high stress levels (>8).'
    ];
    recoveryPlan = [
      'Immediate action: Turn off all screens 1 hour before sleeping.',
      'Initiate a Dopamine Detox focus session (2 hours screen-free).',
      'Delegate or defer non-urgent tasks in the Productivity planner.',
      'Do a 10-minute guided anxiety meditation in the Healing Space.',
      'Consult a peer or notify your Safe Circle about your exhaustion level.'
    ];
  } else if (finalScore > 40) {
    riskLevel = 'Medium';
    reasons = [
      'Increased screen time averages over 6 hours.',
      'Moderate task backlog causing mental clutter.',
      'Slight sleep debt detected in the last few days.'
    ];
    recoveryPlan = [
      'Take a 5-minute stretching break every 90 minutes of work.',
      'Ensure you sleep before 11 PM tonight to pay off sleep debt.',
      'Complete at least one habit tracker goal today.',
      'Use the Pomodoro focus timer to work in intervals rather than non-stop.'
    ];
  }

  res.json({
    score: finalScore,
    riskLevel,
    reasons,
    recoveryPlan,
    weeklySuggestions: [
      'Limit late night laptop usage.',
      'Take a weekend offline detox.',
      'Engage in 3 physical workouts this week.'
    ]
  });
});

// ==========================================
// AI COMPANION ROUTE (CHAT & MEMORY)
// ==========================================
router.post('/ai/chat', authMiddleware, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required.' });

  const userId = req.user.id;
  
  // Get chat history
  const history = db.find('conversations', { userId });
  
  // Call AI response (transcribing Groq context list)
  const aiResponseText = await aiService.generateCompanionResponse(history, message);

  // Save conversation log
  db.insert('conversations', { userId, role: 'user', text: message, createdAt: new Date().toISOString() });
  const savedModelMsg = db.insert('conversations', { userId, role: 'model', text: aiResponseText, createdAt: new Date().toISOString() });

  res.status(201).json(savedModelMsg);
});

router.get('/ai/chat', authMiddleware, (req, res) => {
  const history = db.find('conversations', { userId: req.user.id });
  res.json(history);
});

// ==========================================
// SOCIAL CONFIDENCE TRAINER ROUTE
// ==========================================
let activeScenarios = {}; // Memory placeholder for roleplays: { userId: [messages] }

router.post('/social/chat', authMiddleware, async (req, res) => {
  const { scenario, message, startOver } = req.body;
  const userId = req.user.id;

  if (startOver || !activeScenarios[userId]) {
    activeScenarios[userId] = [
      {
        role: 'model',
        text: scenario === 'interview' ? "Hello! Thanks for coming in today. Can you start by introducing yourself and telling us why you are interested in this position?" :
              scenario === 'presentation' ? "Hi everyone. Let's start the Q&A. Your presentation was interesting, but how do you plan to scale this model without increasing server overhead?" :
              scenario === 'networking' ? "Hi there! I couldn't help but overhear you talking about AI. I'm a developer too. What project are you working on currently?" :
              "Hey! Long time no see. How have you been keeping up lately?"
      }
    ];
    if (startOver) {
      return res.json({ history: activeScenarios[userId] });
    }
  }

  if (message) {
    activeScenarios[userId].push({ role: 'user', text: message });
    
    // Prompt the AI to act as the other participant in the scenario
    let roleplayPrompt = `Scenario context: ${scenario}. Act as the other person in this conversation. Do not respond as a coach or assistant. Keep your response conversational, concise (1-2 sentences), and ask a follow-up question.
Transcript so far:
${activeScenarios[userId].map(m => `${m.role}: ${m.text}`).join('\n')}`;

    let aiText = "That sounds interesting. Could you tell me more about how you handled that?";
    try {
      const groqResp = await aiService.generateCompanionResponse([], roleplayPrompt);
      aiText = groqResp;
    } catch (e) {
      // fallback
    }

    activeScenarios[userId].push({ role: 'model', text: aiText });
  }

  res.json({ history: activeScenarios[userId] });
});

router.post('/social/feedback', authMiddleware, async (req, res) => {
  const { scenario } = req.body;
  const userId = req.user.id;
  const history = activeScenarios[userId] || [];

  const feedback = await aiService.getSocialConfidenceFeedback(scenario, history);
  res.json(feedback);
});

// ==========================================
// HEALING SPACE & SAFE CIRCLE
// ==========================================
router.get('/healing', authMiddleware, (req, res) => {
  const { mode } = req.query; // loneliness, anxiety, breakup, grief, overthinking
  
  const content = {
    anxiety: {
      affirmations: [
        'I am safe. My breathing is slow, calm, and rhythmic.',
        'This feeling will pass. I am in control of my thoughts.',
        'I release all worries that do not serve my growth.'
      ],
      prompts: [
        'What are three physical sensations you feel right now? Describe them neutrally.',
        'Write down the absolute worst case scenario, then write a logical response to why it is unlikely.'
      ],
      audio: [
        { title: 'Gentle Rain on Canvas', duration: '10:00', url: 'rain' },
        { title: 'Binaural Calming Waves (432Hz)', duration: '15:00', url: 'waves' }
      ]
    },
    loneliness: {
      affirmations: [
        'I am connected to the world in deeper ways than I realize.',
        'My own company is a peaceful and healing sanctuary.',
        'It is okay to be alone; this is a season for self-discovery.'
      ],
      prompts: [
        'Write a short letter of appreciation to yourself for your resilience.',
        'What is a hobby or small interest you have wanted to explore?'
      ],
      audio: [
        { title: 'Forest Evening Whispers', duration: '12:00', url: 'forest' },
        { title: 'Warm Ambient Piano Glow', duration: '20:00', url: 'piano' }
      ]
    },
    breakup: {
      affirmations: [
        'I am whole all on my own.',
        'Healing is not linear, and I allow myself to grieve and grow.',
        'I trust the timing of my life.'
      ],
      prompts: [
        'Write down the things you learned about your own strength in this relationship.',
        'What does your ideal future look like when you feel complete and content?'
      ],
      audio: [
        { title: 'Healing Hearth Crackle', duration: '8:00', url: 'hearth' },
        { title: 'Solfeggio Frequency (528Hz)', duration: '15:00', url: 'solfeggio' }
      ]
    }
  };

  const modeKey = mode || 'anxiety';
  res.json(content[modeKey] || content.anxiety);
});

router.post('/circle/sos', authMiddleware, (req, res) => {
  const contacts = db.find('safeCircle', { userId: req.user.id });
  
  // Create a notification about SOS triggers
  db.insert('notifications', {
    userId: req.user.id,
    text: `🚨 SOS triggered! An alert notification has been simulated and sent to: ${contacts.map(c => c.name).join(', ')}.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  res.json({
    message: 'SOS Alerts triggered and simulated successfully.',
    notifiedContacts: contacts
  });
});

router.get('/circle', authMiddleware, (req, res) => {
  const contacts = db.find('safeCircle', { userId: req.user.id });
  res.json(contacts);
});

router.post('/circle', authMiddleware, (req, res) => {
  const { name, phone, email, relation } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Name and Phone are required.' });

  const contact = db.insert('safeCircle', {
    userId: req.user.id,
    name,
    phone,
    email: email || '',
    relation: relation || 'Contact'
  });
  res.status(201).json(contact);
});

// ==========================================
// DAILY AI COACH BRIEFING
// ==========================================
router.get('/coach/briefing', authMiddleware, async (req, res) => {
  const user = db.findOne('users', { id: req.user.id });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Gather stats
  const sleep = db.find('sleepData', { userId: req.user.id });
  const recentSleep = sleep[sleep.length - 1] || { duration: user.sleepHours };

  const stats = {
    sleepHours: recentSleep.duration,
    screenTime: user.screenTime,
    stressLevel: user.stressLevel,
    goals: user.goals || []
  };

  const briefingText = await aiService.generateDailyCoachBriefing(user.name, stats);
  res.json({ briefing: briefingText });
});

// ==========================================
// INSIGHTS & ANALYTICS DASHBOARD
// ==========================================
router.get('/insights', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const moods = db.find('moodLogs', { userId });
  const sleep = db.find('sleepData', { userId });
  const tasks = db.find('tasks', { userId });
  const habits = db.find('habits', { userId });

  // Calculate some analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const productivityRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 75;

  const totalSleepLogs = sleep.length;
  const averageSleep = totalSleepLogs > 0 ? Number((sleep.reduce((sum, item) => sum + item.duration, 0) / totalSleepLogs).toFixed(1)) : 7.0;

  // Mood counts
  const moodDistribution = {};
  moods.forEach(l => {
    moodDistribution[l.mood] = (moodDistribution[l.mood] || 0) + 1;
  });

  const moodBreakdown = Object.keys(moodDistribution).map(name => ({
    name,
    value: moodDistribution[name]
  }));

  // Average stress and energy trends
  const stressEnergyTrends = moods.slice(-7).map(l => ({
    date: new Date(l.date).toLocaleDateString(undefined, { weekday: 'short' }),
    stress: l.stress,
    energy: l.energy,
    productivity: l.productivity
  }));

  const habitStats = habits.map(h => ({
    name: h.name,
    streak: h.streak,
    completionRate: 60 + Math.floor(Math.random()*40) // mock rate for display
  }));

  // Generate an AI monthly report snippet
  const reportText = `Your overall Wellness Score sits at a healthy ${calculateWellnessScore(userId)}/100. 

Stress levels showed a moderate 12% rise around midweek due to academic pressure, corresponding with a sleep drop to 5.5 hours. However, your consistency with the "Meditation" habit (4-day streak) has helped regulate your evening anxiety logs. 

**Recommendation:** Try to cap work sessions at 90 minutes today and use the Pomodoro timer to prevent cognitive exhaustion. Keep drinking 2L of water!`;

  res.json({
    productivityRate,
    averageSleep,
    moodBreakdown: moodBreakdown.length > 0 ? moodBreakdown : [{ name: 'Calm', value: 5 }, { name: 'Joyful', value: 3 }],
    stressEnergyTrends: stressEnergyTrends.length > 0 ? stressEnergyTrends : [
      { date: 'Mon', stress: 4, energy: 6, productivity: 7 },
      { date: 'Tue', stress: 5, energy: 5, productivity: 6 },
      { date: 'Wed', stress: 7, energy: 4, productivity: 5 },
      { date: 'Thu', stress: 6, energy: 6, productivity: 8 }
    ],
    habitStats,
    aiWeeklyReport: reportText
  });
});

export default router;
