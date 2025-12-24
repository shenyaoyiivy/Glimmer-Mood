
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GenerationResult, MoodEntry, PhaseReport } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function processMoodText(text: string): Promise<GenerationResult> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze this daily log: "${text}". 
    Tasks:
    1. Extract 2-3 keywords for a clean visual atmosphere.
    2. Create a very short, healing Chinese phrase (MAX 8 characters). This is a subtitle.
    3. Extract 1-3 core "Happy Highlights" (核心开心瞬间). Each highlight MUST be extremely short (2-4 Chinese characters, e.g., "吃大餐", "见Crush", "被夸奖").
    4. Write an English prompt for a background image. Style: "Vast whitespace, ultra-minimalist, soft color aura, atmospheric background, subtle gradients, organic ethereal shapes, clean, bright, Zen-like aesthetic, low contrast". Avoid busy details.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          imagePrompt: { type: Type.STRING },
          poeticQuote: { type: Type.STRING },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["imagePrompt", "poeticQuote", "keywords", "highlights"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data;
  } catch (e) {
    throw new Error("Failed to parse AI response");
  }
}

export async function generatePhaseReport(entries: MoodEntry[], startDate: string, endDate: string, customInstruction?: string): Promise<PhaseReport> {
  const model = "gemini-3-pro-preview"; 
  const combinedText = entries.map(e => `[${e.date}] ${e.rawText}`).join('\n');
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze these mood records from ${startDate} to ${endDate}:\n${combinedText}\n
    User's Special Request for the Report Vibe: "${customInstruction || "Default: Poetic, healing, and warm"}"
    
    Create a highly personalized, poetic, and healing report (年度报告风格). 
    Requirements:
    1. title: A beautiful 4-6 character title.
    2. summary: A 50-word healing summary of the overall vibe.
    3. moodVibe: 2-3 words describing the core emotion.
    4. topKeywords: 5 high-frequency keywords with count (be accurate).
    5. personalNarratives: 3-4 highly specific sentences like "During this time, you mentioned [something specific] X times, it must have brought you [emotion]." or "You went to [place], these memories made your month shine."
    6. visualTheme: A color description like "Sunset Amber", "Forest Mist", or "Ocean Breeze".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          moodVibe: { type: Type.STRING },
          topKeywords: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                count: { type: Type.NUMBER }
              },
              required: ["text", "count"]
            }
          },
          personalNarratives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          visualTheme: { type: Type.STRING }
        },
        required: ["title", "summary", "moodVibe", "topKeywords", "personalNarratives", "visualTheme"]
      }
    }
  });

  const rawData = JSON.parse(response.text);
  
  return {
    ...rawData,
    stats: {
      totalDays: entries.length,
      recordedDays: entries.length,
      highLightCount: entries.reduce((acc, curr) => acc + (curr.highlights?.length || 0), 0)
    }
  };
}

export async function generateMoodImage(prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-image';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("No image generated");
  return imageUrl;
}
