import { GoogleGenAI, Type } from "@google/genai";
import { Routine, Event } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });

export const analyzeRoutine = async (routines: Routine[], events: Event[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Current Routines: ${JSON.stringify(routines)}
        Current Events: ${JSON.stringify(events)}
        
        Task: Analyze the user's routine and schedule. 
        1. Identify potential conflicts.
        2. Suggest 3 ways to optimize for productivity.
        3. Provide a motivational insight based on the schedule density.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conflicts: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            insight: { type: Type.STRING }
          },
          required: ["conflicts", "suggestions", "insight"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};