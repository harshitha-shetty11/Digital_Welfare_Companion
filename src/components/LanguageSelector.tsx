import React from 'react';
import { Language, LanguageInfo } from '../types';
import { getLanguages } from '../utils/languages';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const languages = getLanguages();

  return (
    <div className="language-selector">
      <label htmlFor="language-select">भाषा / Language:</label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => {
          onLanguageChange(e.target.value as Language);
        }}
      >
        {languages.map((language: LanguageInfo) => (
          <option key={language.code} value={language.code}>
            {language.nativeName} ({language.name})
          </option>
        ))}
      </select>
    </div>
  );
};
