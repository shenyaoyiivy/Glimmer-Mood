
export interface MoodEntry {
  id: string;
  date: string; // ISO string
  rawText: string;
  poeticQuote: string;
  imageUrl: string;
  keywords: string[];
  highlights: string[]; 
}

export type ViewType = 'today' | 'week' | 'history' | 'calendar' | 'report';

export interface GenerationResult {
  imagePrompt: string;
  poeticQuote: string;
  keywords: string[];
  highlights: string[];
}

export interface PhaseReport {
  title: string;
  summary: string;
  moodVibe: string; // e.g. "松弛、充满期待"
  topKeywords: { text: string; count: number }[];
  personalNarratives: string[]; // Personalized "Yearly report style" sentences
  stats: {
    totalDays: number;
    recordedDays: number;
    highLightCount: number;
  };
  visualTheme: string; // Color palette or vibe for the UI
}
