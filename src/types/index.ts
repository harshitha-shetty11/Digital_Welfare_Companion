export type Language = 'hi' | 'en' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as' | 'ur';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: Language;
  schemes?: Scheme[];
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  applicationProcess: string;
  documents: string[];
  category: string;
  state?: string;
  lastUpdated: Date;
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
}

export interface VoiceSettings {
  isEnabled: boolean;
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ChatRequest {
  message: string;
  language: string;
  userId?: string;
}

export interface ChatResponse {
  reply: string;
  schemes?: Scheme[];
  followUpQuestions?: string[];
}
