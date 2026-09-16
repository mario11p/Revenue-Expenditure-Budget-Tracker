const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_PATH = `${API_BASE_URL}/api/gemini`;

export type ChatHistoryItem = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

type GeminiRequest =
  | { operation: 'chat'; history: ChatHistoryItem[]; message: string }
  | { operation: 'analyze'; context: string; prompt: string }
  | { operation: 'simulate'; policyText: string };

const MAX_INPUT_LENGTH = 50_000;

async function requestGemini(body: GeminiRequest): Promise<string> {
  const response = await fetch(API_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = 'The AI service is unavailable.';
    try {
      const payload = await response.json() as { error?: string };
      if (payload.error) detail = payload.error;
    } catch {
      // Keep the generic error when the server response is not JSON.
    }
    throw new Error(detail);
  }

  const payload = await response.json() as { text?: string };
  if (!payload.text) throw new Error('The AI service returned an empty response.');
  return payload.text;
}

function validateText(value: string, name: string): string {
  const text = value.trim();
  if (!text) throw new Error(`${name} cannot be empty.`);
  if (text.length > MAX_INPUT_LENGTH) {
    throw new Error(`${name} is too large. Please shorten it and try again.`);
  }
  return text;
}

export const geminiService = {
  async sendMessage(history: ChatHistoryItem[], message: string): Promise<string> {
    const safeHistory = history.slice(-50).map((item) => ({
      role: item.role,
      parts: [{ text: validateText(item.parts?.[0]?.text || '', 'Message') }],
    }));

    return requestGemini({
      operation: 'chat',
      history: safeHistory,
      message: validateText(message, 'Message'),
    });
  },

  async analyzeData(context: string, prompt: string): Promise<string> {
    return requestGemini({
      operation: 'analyze',
      context: validateText(context, 'Context'),
      prompt: validateText(prompt, 'Prompt'),
    });
  },

  async simulatePolicy(policyText: string): Promise<string> {
    return requestGemini({
      operation: 'simulate',
      policyText: validateText(policyText, 'Policy text'),
    });
  },
};
