import { useState, useEffect, useCallback } from 'react';
import { getSpeechSynthesisLang } from '../utils/languages';
import { VoiceSettings } from '../types';

interface UseSpeechSynthesisProps {
  settings: VoiceSettings;
}

export const useSpeechSynthesis = ({ settings }: UseSpeechSynthesisProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !settings.isEnabled) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find appropriate voice for the language
    const targetLang = getSpeechSynthesisLang(settings.language);
    const voice = voices.find(v => 
      v.lang.startsWith(settings.language) || 
      v.lang.startsWith(targetLang)
    );
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, [isSupported, settings, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices
  };
};
