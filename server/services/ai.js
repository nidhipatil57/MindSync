import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

let groq = null;
if (process.env.GROQ_API_KEY) {
  try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  } catch (err) {
    console.error('Failed to initialize Groq SDK:', err);
  }
}

// System prompts
const COMPANION_PROMPT = `You are MindSync, a calming, modern, and empathetic AI Wellness & Life Companion.
Your tone is gentle, warm, supportive, and non-judgmental (similar to a premium wellness app like Headspace).
You offer emotional support, stress management tips, habit coaching, productivity guidance, and breathing exercises.
Keep your responses relatively brief (1-3 small paragraphs), formatting with bullet points or bold text where appropriate to be highly readable.
Do not sound clinical; sound human, warm, and comforting.`;

const JOURNAL_PROMPT = `Analyze the following journal entry. Output a valid JSON object ONLY.
The JSON must have the following fields:
1. "summary": A brief 1-2 sentence summary of what the user wrote.
2. "emotions": An array of 2-3 detected emotions (e.g. "Peaceful", "Anxious", "Stressed", "Exhausted", "Joyful", "Lonely").
3. "triggers": An array of 1-3 identified external triggers or themes (e.g. "Work pressure", "Morning coffee", "Lack of sleep", "Social interaction").

Do not include any markdown styling like \`\`\`json or text outside the JSON object.
Journal Entry: `;

const COUCH_PROMPT = (name, stats) => `Create a personalized, warm morning briefing for ${name}.
Current stats:
- Sleep duration: ${stats.sleepHours} hours
- Daily Screen Time: ${stats.screenTime}
- Stress level: ${stats.stressLevel}/10
- Main wellness goals: ${stats.goals.join(', ')}

Structure the response as:
"Good Morning, ${name}.
[A 2-sentence encouraging analysis of their stats and wellness status]

Today's MindSync focus:
- [Actionable item 1 related to sleep or screen time]
- [Actionable item 2 related to habits or water]
- [Actionable item 3 related to productivity or focus]

Have a peaceful and productive day!"`;

const SOCIAL_PROMPT = `You are grading a mock social roleplay session. The scenario was: `;

// Fallbacks for when Groq is not available/configured
const getMockCompanionResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();
  if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worry')) {
    return "I hear you, and it is completely okay to feel anxious. Let's take a slow breath together. Inhale for 4 seconds, hold for 4, and let it go. Remember, you don't have to navigate everything at once. Focus on just the next small step. What is one tiny thing you can control right now?";
  }
  if (msg.includes('tired') || msg.includes('sleep') || msg.includes('exhausted')) {
    return "It sounds like your body is asking for rest. Sleep and energy levels have a massive impact on our emotional wellbeing. For tonight, try to set a wind-down reminder, turn off screens 30 minutes before bed, and treat yourself to some quiet time. You've worked hard; you deserve to rest.";
  }
  if (msg.includes('stress') || msg.includes('overwhelm') || msg.includes('busy')) {
    return "When tasks pile up, our minds tend to run in circles. Let's try to offload some of that weight. If you could write down just three tasks for today and archive the rest, what would they be? Setting small boundaries helps protect your peace.";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! I am MindSync, your wellness companion. How are you feeling today? I am here to help you log your mood, organize your tasks, or simply take a breathing break.";
  }
  return "Thank you for sharing that with me. Your feelings are entirely valid. Let's focus on nurturing your energy today. Would you like to do a quick 2-minute breathing exercise, or write down a small gratitude entry to ground yourself?";
};

const getMockJournalAnalysis = (content) => {
  const c = content.toLowerCase();
  let emotions = ['Calm', 'Reflective'];
  let triggers = ['Routine'];
  let summary = "User reflected on their daily experience and thoughts.";

  if (c.includes('stress') || c.includes('exam') || c.includes('work') || c.includes('deadline')) {
    emotions = ['Anxious', 'Exhausted'];
    triggers = ['Academic stress', 'Workload'];
    summary = "User expressed feelings of stress and pressure regarding deadlines or studies.";
  } else if (c.includes('walk') || c.includes('nature') || c.includes('happy') || c.includes('park')) {
    emotions = ['Joyful', 'Peaceful'];
    triggers = ['Nature', 'Exercise'];
    summary = "User enjoyed a peaceful activity outdoors, boosting their emotional well-being.";
  } else if (c.includes('sad') || c.includes('lonely') || c.includes('breakup') || c.includes('miss')) {
    emotions = ['Lonely', 'Sad'];
    triggers = ['Relationships', 'Isolation'];
    summary = "User shared vulnerable emotions regarding relationships and feelings of loneliness.";
  }

  return { summary, emotions, triggers };
};

const getMockDailyCoachBriefing = (name, stats) => {
  return `Good Morning, ${name}.

You slept ${stats.sleepHours} hours last night. Your stress level is currently flagged at ${stats.stressLevel}/10, and we noticed screen time has been averaging ${stats.screenTime}. Let's focus on restoring balance today.

Today's MindSync focus:
• **Take a 15-minute screen break** after every 90 minutes of work.
• **Complete one 5-minute breathing session** in the AI Companion when stress rises.
• **Drink 2 Liters of water** to keep your energy and concentration high.

Have a peaceful and productive day!`;
};

const getMockSocialFeedback = (scenario, chatHistory) => {
  // Scenario: interview, casual, presentation, networking
  let confidenceScore = 82;
  let speed = '130 words per minute (Perfect conversational pace)';
  let fillerWords = ['like', 'um'];
  let suggestions = [
    "Try to expand on your answers slightly more to showcase detailed context.",
    "Pause for 1 second before speaking to gather your thoughts instead of using filler words.",
    "Maintain a steady breathing rhythm during questions to project confidence."
  ];

  if (scenario.includes('interview')) {
    confidenceScore = 85;
    fillerWords = ['actually', 'uh'];
  } else if (scenario.includes('casual')) {
    confidenceScore = 90;
    speed = '145 words per minute (Energetic and friendly)';
  } else if (scenario.includes('presentation')) {
    confidenceScore = 78;
    speed = '110 words per minute (Slightly rushed in parts)';
    fillerWords = ['so', 'basically', 'um'];
  }

  return {
    confidenceScore,
    speed,
    fillerWords,
    suggestions
  };
};

export const aiService = {
  generateCompanionResponse: async (chatHistory, userMessage) => {
    if (!groq) {
      // Simulate typing/streaming delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return getMockCompanionResponse(userMessage);
    }
    try {
      const messages = [
        { role: 'system', content: COMPANION_PROMPT },
        ...chatHistory.slice(-6).map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text
        })),
        { role: 'user', content: userMessage }
      ];

      const completion = await groq.chat.completions.create({
        messages,
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 400
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error('Groq companion error:', err);
      return getMockCompanionResponse(userMessage);
    }
  },

  analyzeJournalEntry: async (content) => {
    if (!groq) {
      return getMockJournalAnalysis(content);
    }
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You analyze journal entries and return JSON responses.' },
          { role: 'user', content: JOURNAL_PROMPT + content }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.2,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0].message.content.trim();
      return JSON.parse(responseText);
    } catch (err) {
      console.error('Groq journal analysis error:', err);
      return getMockJournalAnalysis(content);
    }
  },

  generateDailyCoachBriefing: async (name, stats) => {
    if (!groq) {
      return getMockDailyCoachBriefing(name, stats);
    }
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a warm, helpful wellness coach summarizing daily briefings.' },
          { role: 'user', content: COUCH_PROMPT(name, stats) }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 300
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error('Groq coach briefing error:', err);
      return getMockDailyCoachBriefing(name, stats);
    }
  },

  getSocialConfidenceFeedback: async (scenario, chatHistory) => {
    if (!groq) {
      return getMockSocialFeedback(scenario, chatHistory);
    }
    try {
      const transcript = chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n');
      const prompt = `Analyze the following mock-interview roleplay transcript. The user roleplayed a "${scenario}" scenario.
Generate a feedback analysis in JSON format containing:
1. "confidenceScore": integer between 40 and 100
2. "speed": string describing their speaking speed/wpm
3. "fillerWords": array of detected filler words
4. "suggestions": array of 3 bullet points for improvement

Output JSON ONLY.
Transcript:
${transcript}`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'You evaluate roleplay dialogues and output feedback in JSON format.' },
          { role: 'user', content: prompt }
        ],
        model: 'llama3-8b-8192',
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0].message.content.trim();
      return JSON.parse(responseText);
    } catch (err) {
      console.error('Groq social feedback error:', err);
      return getMockSocialFeedback(scenario, chatHistory);
    }
  }
};
