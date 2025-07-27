import React, { useState, useEffect, useRef } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { Language } from '../types';

interface VoiceAssistantProps {
  onUserInput: (text: string) => void;
  language: Language;
  isLoading: boolean;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ 
  onUserInput, 
  language, 
  isLoading 
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useVoiceRecognition(language);

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      startListening();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onUserInput(inputText.trim());
      setInputText('');
      resetTranscript();
    }
  };

  const getPlaceholder = () => {
    const placeholders: Record<Language, string> = {
      'en': 'Ask about government schemes...',
      'hi': 'सरकारी योजनाओं के बारे में पूछें...',
      'ta': 'அரசு திட்டங்களைப் பற்றி கேளுங்கள்...',
      'te': 'ప్రభుత్వ పథకాల గురించి అడగండి...',
      'bn': 'সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...',
      'mr': 'सरकारी योजनांबद्दल विचारा...',
      'gu': 'સરકારી યોજનાઓ બાબતે પૂછો...',
      'kn': 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
      'ml': 'സർക്കാർ പദ്ധതികൾ കുറിച്ച് ചോദിക്കുക...',
      'pa': 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ...',
      'or': 'ସରକାରୀ ଯୋଜନା ବିଷୟରେ ପ୍ରଶ୍ନ କରନ୍ତୁ...',
      'as': 'চরকারী যোজনার বিষয়ে সোধা করক...',
      'ur': 'حکومتی اسکیموں کے بارے میں پوچھیں...'
    };
    return placeholders[language] || placeholders['en'];
  };

  return (
    <div className="voice-assistant">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={isLoading}
            className="text-input"
          />
          
          {browserSupportsSpeechRecognition && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={`voice-button ${isListening ? 'listening' : ''}`}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
          
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </form>

      {isListening && (
        <div className="listening-indicator">
          <div className="pulse"></div>
          <span>सुन रहा हूँ...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
