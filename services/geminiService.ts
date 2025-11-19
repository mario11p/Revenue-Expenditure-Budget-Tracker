import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize the Gemini API client
// process.env.API_KEY is guaranteed to be available in this environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Sends a chat message to the AI model.
   */
  async sendMessage(history: { role: string; parts: { text: string }[] }[], message: string): Promise<string> {
    try {
      const model = 'gemini-2.5-flash';
      
      // We use generateContent here for a single turn interaction based on history context manually managed 
      // or use chat. But for simplicity and statelessness in this helper, we'll use a chat session pattern
      // if we were persisting the object. Here we will use generateContent with the full context string construction
      // or use the chat API properly. Let's use the Chat API properly.
      
      const chat = ai.chats.create({
        model: model,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history, 
      });

      const result: GenerateContentResponse = await chat.sendMessage({ message });
      return result.text || "No response generated.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      throw error;
    }
  },

  /**
   * Analyzes a specific dataset or document content.
   */
  async analyzeData(context: string, prompt: string): Promise<string> {
    try {
        const model = 'gemini-2.5-flash';
        const response = await ai.models.generateContent({
            model,
            contents: `Context Data: ${context}\n\nUser Request: ${prompt}`,
            config: {
                systemInstruction: "You are a senior data analyst for the Treasury. Provide concise, bulleted insights.",
                thinkingConfig: { thinkingBudget: 1024 } // Using a bit of thinking for deeper analysis
            }
        });
        return response.text || "Analysis failed.";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return "Detailed analysis is currently unavailable due to a service interruption.";
    }
  },

  /**
   * Simulates a policy impact analysis.
   */
  async simulatePolicy(policyText: string): Promise<string> {
      try {
          const model = 'gemini-2.5-flash';
          const response = await ai.models.generateContent({
              model,
              contents: `Proposed Policy: ${policyText}\n\nAnalyze the potential impact of this policy on national revenue (VAT, Corporate Tax, Income Tax) and inflation over the next 3 years.`,
              config: {
                thinkingConfig: { thinkingBudget: 2048 } // More budget for complex simulation
              }
          });
          return response.text || "Simulation failed.";
      } catch (error) {
          console.error("Policy Simulation Error:", error);
          throw error;
      }
  }
};
