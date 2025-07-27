import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Type definitions
type Language = 'en' | 'hi' | 'te' | 'ta' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa' | 'or' | 'as' | 'ur';
// Language Detection Service - Add this before the App component
interface DetectedLanguage {
  language: Language;
  confidence: number;
}

class LanguageDetectionService {
  private static readonly LANGUAGE_PATTERNS = {
    hi: ['है', 'में', 'के', 'की', 'को', 'और', 'या', 'से', 'पर', 'मैं', 'आप', 'यह', 'वह'],
    te: ['లో', 'కు', 'నుండి', 'తో', 'అని', 'ఉంది', 'అవుతుంది', 'చేయాలి', 'వచ్చింది', 'మరియు'],
    ta: ['இல்', 'கு', 'ஆக', 'ல்', 'உம்', 'ஆன', 'என்று', 'செய்', 'வரும்', 'மற்றும்'],
    bn: ['এর', 'তে', 'কে', 'হয়', 'করে', 'থেকে', 'সাথে', 'আমি', 'তুমি', 'এবং'],
    mr: ['मध्ये', 'ला', 'ने', 'आहे', 'करून', 'पासून', 'सोबत', 'मी', 'तुम्ही', 'आणि'],
    gu: ['માં', 'ને', 'થી', 'સાથે', 'છે', 'કરીને', 'હું', 'તમે', 'અને'],
    kn: ['ಯಲ್ಲಿ', 'ಗೆ', 'ಇಂದ', 'ಜೊತೆ', 'ಇದೆ', 'ಮಾಡಿ', 'ನಾನು', 'ನೀವು', 'ಮತ್ತು'],
    ml: ['ൽ', 'ക്ക്', 'ൽ നിന്ന്', 'ഓട്', 'ആണ്', 'ചെയ്ത്', 'ഞാൻ', 'നിങ്ങൾ', 'ഉം'],
    pa: ['ਵਿੱਚ', 'ਨੂੰ', 'ਤੋਂ', 'ਨਾਲ', 'ਹੈ', 'ਕਰਕੇ', 'ਮੈਂ', 'ਤੁਸੀਂ', 'ਅਤੇ'],
    or: ['ରେ', 'କୁ', 'ରୁ', 'ସହିତ', 'ଅଛି', 'କରି', 'ମୁଁ', 'ଆପଣ', 'ଏବଂ'],
    as: ['ত', 'লৈ', 'ৰ পৰা', 'সৈতে', 'আছে', 'কৰি', 'মই', 'আপুনি', 'আৰু'],
    ur: ['میں', 'کو', 'سے', 'کے ساتھ', 'ہے', 'کرکے', 'میں', 'آپ', 'اور'],
    en: ['the', 'is', 'and', 'to', 'of', 'in', 'for', 'with', 'on', 'at', 'by', 'from']
  };

  private static readonly SCRIPT_PATTERNS = {
    hi: /[\u0900-\u097F]/, // Devanagari
    te: /[\u0C00-\u0C7F]/, // Telugu
    ta: /[\u0B80-\u0BFF]/, // Tamil
    bn: /[\u0980-\u09FF]/, // Bengali
    mr: /[\u0900-\u097F]/, // Devanagari (same as Hindi)
    gu: /[\u0A80-\u0AFF]/, // Gujarati
    kn: /[\u0C80-\u0CFF]/, // Kannada
    ml: /[\u0D00-\u0D7F]/, // Malayalam
    pa: /[\u0A00-\u0A7F]/, // Gurmukhi
    or: /[\u0B00-\u0B7F]/, // Oriya
    as: /[\u0980-\u09FF]/, // Bengali script (used for Assamese)
    ur: /[\u0600-\u06FF]/, // Arabic script
    en: /[a-zA-Z]/ // Latin script
  };

  static detectLanguage(text: string): DetectedLanguage {
    if (!text || text.trim().length === 0) {
      return { language: 'en', confidence: 0 };
    }

    const scores: { [key in Language]: number } = {
      en: 0, hi: 0, te: 0, ta: 0, bn: 0, mr: 0, 
      gu: 0, kn: 0, ml: 0, pa: 0, or: 0, as: 0, ur: 0
    };

    const cleanText = text.toLowerCase().trim();

    // Script-based detection (highest weight)
    Object.entries(this.SCRIPT_PATTERNS).forEach(([lang, pattern]) => {
      const matches = cleanText.match(pattern);
      if (matches) {
        scores[lang as Language] += matches.length * 3;
      }
    });

    // Pattern-based detection
    Object.entries(this.LANGUAGE_PATTERNS).forEach(([lang, patterns]) => {
      patterns.forEach(pattern => {
        const regex = new RegExp(`\\b${pattern.toLowerCase()}\\b`, 'g');
        const matches = cleanText.match(regex);
        if (matches) {
          scores[lang as Language] += matches.length * 2;
        }
      });
    });

    // Find the language with highest score
    const detectedLang = Object.entries(scores).reduce((a, b) => 
      scores[a[0] as Language] > scores[b[0] as Language] ? a : b
    )[0] as Language;

    const maxScore = scores[detectedLang];
    const confidence = Math.min(maxScore / cleanText.length, 1);

    // Fallback to English if confidence is too low
    if (confidence < 0.1) {
      return { language: 'en', confidence: 0.5 };
    }

    return { language: detectedLang, confidence };
  }
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  schemes?: WelfareScheme[];
}

interface WelfareScheme {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  benefitAmount?: LocalizedText;
  eligibility?: any;
  documents?: string[];
  applicationUrl?: string;
  state?: string;
}

interface LocalizedText {
  [key: string]: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  relevance: number;
};


// Language configurations
const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' }
];

// UI Text translations
// UI Text translations - CORRECTED VERSION
const uiText: { [key: string]: LocalizedText } = {
  mainTitle: {
    en: "How can I help you today?",
    hi: "आज मैं आपकी कैसे मदद कर सकता हूं?",
    te: "నేను ఈ రోజు మీకు ఎలా సహాయం చేయగలను?",
    ta: "இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    bn: "আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
    mr: "आज मी तुमची कशी मदत करू शकतो?",
    gu: "આજે હું તમારી કેવી રીતે મદદ કરી શકું?",
    kn: "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    ml: "ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?",
    pa: "ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    or: "ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?",
    as: "আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
    ur: "آج میں آپ کی کیسے مدد کر سکتا ہوں؟"
  },
  inputPlaceholder: {
    en: "Ask about government schemes...",
    hi: "सरकारी योजनाओं के बारे में पूछें...",
    te: "ప్రభుత్వ పథకాల గురించి అడగండి...",
    ta: "அரசு திட்டங்களைப் பற்றி கேளுங்கள்...",
    bn: "সরকারি প্রকল্প সম্পর্কে জিজ্ঞাসা করুন...",
    mr: "सरकारी योजनांबद्दल विचारा...",
    gu: "સરકારી યોજનાઓ વિશે પૂછો...",
    kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    ml: "സർക്കാർ പദ്ധതികളെക്കുറിച്ച് ചോദിക്കുക...",
    pa: "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
    or: "ସରକାରୀ ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ...",
    as: "চৰকাৰী আঁচনি সম্পৰ্কে সুধিব...",
    ur: "سرکاری اسکیموں کے بارے میں پوچھیں..."
  },
  listening: {
    en: "Listening...",
    hi: "सुन रहा हूं...",
    te: "వింటున్నాను...",
    ta: "கேட்டுக்கொண்டிருக்கிறேன்...",
    bn: "শুনছি...",
    mr: "ऐकत आहे...",
    gu: "સાંભળી રહ્યો છું...",
    kn: "ಕೇಳುತ್ತಿದ್ದೇನೆ...",
    ml: "കേൾക്കുന്നു...",
    pa: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
    or: "ଶୁଣୁଛି...",
    as: "শুনি আছোঁ...",
    ur: "سن رہا ہوں..."
  },
  quickActions: {
    en: "Quick Actions",
    hi: "त्वरित कार्य",
    te: "త్వరిత చర్యలు",
    ta: "விரைவான செயல்கள்",
    bn: "দ্রুত কর্ম",
    mr: "त्वरित कृति",
    gu: "ઝડપી ક્રિયાઓ",
    kn: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    ml: "വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ",
    pa: "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
    or: "ତ୍ୱରିତ କାର୍ଯ୍ୟ",
    as: "দ্ৰুত কাৰ্য",
    ur: "فوری اقدامات"
  },
  popularSchemes: {
    en: "Popular Schemes",
    hi: "लोकप्रिय योजनाएं",
    te: "ప్రసిద్ధ పథకాలు",
    ta: "பிரபலமான திட்டங்கள்",
    bn: "জনপ্রিয় প্রকল্প",
    mr: "लोकप्रिय योजना",
    gu: "લોકપ્રિય યોજનાઓ",
    kn: "ಜನಪ್ರಿಯ ಯೋಜನೆಗಳು",
    ml: "ജനപ്രിയ പദ്ധതികൾ",
    pa: "ਪ੍ਰਸਿੱਧ ਯੋਜਨਾਵਾਂ",
    or: "ଲୋକପ୍ରିୟ ଯୋଜନା",
    as: "জনপ্ৰিয় আঁচনি",
    ur: "مقبول اسکیمز"
  }, // ← MISSING COMMA WAS HERE
  languageDetected: {
    en: "Language detected:",
    hi: "भाषा का पता चला:",
    te: "భాష గుర్తించబడింది:",
    ta: "மொழி கண்டறியப்பட்டது:",
    bn: "ভাষা সনাক্ত করা হয়েছে:",
    mr: "भाषा ओळखली:",
    gu: "ભાષા શોધાઈ:",
    kn: "ಭಾಷೆ ಪತ್ತೆಯಾಗಿದೆ:",
    ml: "ഭാഷ കണ്ടെത്തി:",
    pa: "ਭਾਸ਼ਾ ਲੱਭੀ:",
    or: "ଭାଷା ଚିହ୍ନଟ:",
    as: "ভাষা চিনাক্ত:",
    ur: "زبان کی شناخت:"
  },
  voiceAssistantActive: {
    en: "🎤 Voice Assistant Active",
    hi: "🎤 आवाज सहायक सक्रिय",
    te: "🎤 వాయిస్ అసిస్టెంట్ చురుకుగా ఉంది",
    ta: "🎤 குரல் உதவியாளர் செயல்பாட்டில்",
    bn: "🎤 ভয়েস অ্যাসিস্ট্যান্ট সক্রিয়",
    mr: "🎤 आवाज सहाय्यक सक्रिय",
    gu: "🎤 વૉઇસ આસિસ્ટન્ટ સક્રિય",
    kn: "🎤 ಧ್ವನಿ ಸಹಾಯಕ ಸಕ್ರಿಯ",
    ml: "🎤 വോയ്സ് അസിസ്റ്റന്റ് സജീവം",
    pa: "🎤 ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਸਰਗਰਮ",
    or: "🎤 ଭଏସ ଆସିଷ୍ଟାଣ୍ଟ ସକ୍ରିୟ",
    as: "🎤 ভয়েচ সহায়ক সক্ৰিয়",
    ur: "🎤 آواز معاون فعال"
  },
  errorMessage: {
    en: "Sorry, I encountered an error. Please try again.",
    hi: "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
    te: "క్షమించండి, నాకు దోషం ఎదురైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    ta: "மன்னிக்கவும், எனக்கு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    bn: "দুঃখিত, আমার একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    mr: "क्षमस्व, मला एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.",
    gu: "માફ કરશો, મને ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.",
    kn: "ಕ್ಷಮಿಸಿ, ನನಗೆ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    ml: "ക്ഷമിക്കുക, എനിക്ക് പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.",
    pa: "ਮਾਫ ਕਰੋ, ਮੈਨੂੰ ਇੱਕ ਗਲਤੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    or: "ଦୁଃଖିତ, ମୋର ଏକ ତ୍ରୁଟି ହୋଇଛି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।",
    as: "দুঃখিত, মোৰ এটা ভুল হৈছে। অনুগ্ৰহ কৰি আকৌ চেষ্টা কৰক।",
    ur: "معذرت، مجھے ایک خرابی کا سامنا ہوا۔ برائے کرم دوبارہ کوشش کریں۔"
  }
};


// Comprehensive schemes data with multilingual support
const sampleSchemes: WelfareScheme[] = [
  {
    id: 1,
    name: {
      en: 'PM-KISAN Samman Nidhi',
      hi: 'प्रधानमंत्री किसान सम्मान निधि',
      te: 'ప్రధానమంత్రి కిసాన్ సమ్మాన్ నిధి',
      ta: 'பிரதான மந்திரி கிசான் சம்மான் நிதி',
      bn: 'প্রধানমন্ত্রী কিসান সম্মান নিধি',
      mr: 'प्रधानमंत्री किसान सम्मान निधी',
      gu: 'પ્રધાનમંત્રી કિસાન સમ્માન નિધિ',
      kn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
      ml: 'പ്രധാനമന്ത്രി കിസാൻ സമ്മാൻ നിധി',
      pa: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਕਿਸਾਨ ਸਮ੍ਮਾਨ ਨਿਧੀ',
      or: 'ପ୍ରଧାନମନ୍ତ୍ରୀ କିସାନ ସମ୍ମାନ ନିଧି',
      as: 'প্ৰধানমন্ত্ৰী কিসান সম্মান নিধি',
      ur: 'وزیر اعظم کسان سمان نذیر'
    },
    description: {
      en: 'Financial assistance to small and marginal farmers',
      hi: 'छोटे और सीमांत किसानों को वित्तीय सहायता',
      te: 'చిన్న మరియు ఉపాంత రైతులకు ఆర్థిక సహాయం',
      ta: 'சிறு மற்றும் குறு விவசாயிகளுக்கு நிதி உதவி',
      bn: 'ক্ষুদ্র ও প্রান্তিক কৃষকদের আর্থিক সহায়তা',
      mr: 'लहान आणि सीमांत शेतकऱ्यांना आर्थिक मदत',
      gu: 'નાના અને સીમાંત ખેડૂતોને નાણાકીય સહાય',
      kn: 'ಸಣ್ಣ ಮತ್ತು ಕನಿಷ್ಠ ರೈತರಿಗೆ ಆರ್ಥಿಕ ಸಹಾಯ',
      ml: 'ചെറുകിട-കുറുകിട കർഷകർക്ക് സാമ്പത്തിക സഹായം',
      pa: 'ਛੋਟੇ ਅਤੇ ਸੀਮਾਂਤ ਕਿਸਾਨਾਂ ਨੂੰ ਵਿੱਤੀ ਸਹਾਇਤਾ',
      or: 'କ୍ଷୁଦ୍ର ଓ ସୀମାନ୍ତ ଚାଷୀଙ୍କୁ ଆର୍ଥିକ ସହାୟତା',
      as: 'ক্ষুদ্ৰ আৰু প্ৰান্তিক কৃষকসকলৰ বাবে আৰ্থিক সাহায্য',
      ur: 'چھوٹے اور حاشیہ نشین کسانوں کو مالی امداد'
    },
    category: 'agriculture',
    benefitAmount: {
      en: '₹6,000 per year',
      hi: '₹6,000 प्रति वर्ष',
      te: 'సంవత్సరానికి ₹6,000',
      ta: 'ஆண்டுக்கு ₹6,000',
      bn: 'বছরে ₹6,000',
      mr: '₹6,000 प्रति वर्ष',
      gu: 'વર્ષે ₹6,000',
      kn: 'ವರ್ಷಕ್ಕೆ ₹6,000',
      ml: 'വർഷത്തിൽ ₹6,000',
      pa: 'ਸਾਲ ਵਿੱਚ ₹6,000',
      or: 'ବର୍ଷରେ ₹6,000',
      as: 'বছৰত ₹6,000',
      ur: 'سال میں ₹6,000'
    },
    applicationUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 2,
    name: {
      en: 'Ayushman Bharat',
      hi: 'आयुष्मान भारत',
      te: 'ఆయుష్మాన్ భారత్',
      ta: 'ஆயுஷ்மான் பாரத்',
      bn: 'আয়ুষ্মান ভারত',
      mr: 'आयुष्मान भारत',
      gu: 'આયુષ્માન ભારત',
      kn: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್',
      ml: 'ആയുഷ്മാൻ ഭാരത്',
      pa: 'ਆਯੁਸ਼ਮਾਨ ਭਾਰਤ',
      or: 'ଆୟୁଷ୍ମାନ ଭାରତ',
      as: 'আয়ুষ্মান ভাৰত',
      ur: 'آیوشمان بھارت'
    },
    description: {
      en: 'Health insurance scheme for families',
      hi: 'परिवारों के लिए स्वास्थ्य बीमा योजना',
      te: 'కుటుంబాలకు ఆరోగ్య బీమా పథకం',
      ta: 'குடும்பங்களுக்கான சுகாதார காப்பீட்டு திட்டம்',
      bn: 'পরিবারের জন্য স্বাস্থ্য বীমা প্রকল্প',
      mr: 'कुटुंबांसाठी आरोग्य विमा योजना',
      gu: 'પરિવાર માટે આરોગ્ય વીમા યોજના',
      kn: 'ಕುಟುಂಬಗಳಿಗೆ ಆರೋಗ್ಯ ವಿಮಾ ಯೋಜನೆ',
      ml: 'കുടുംബങ്ങൾക്കുള്ള ആരോഗ്യ ഇൻഷുറൻസ് പദ്ധതി',
      pa: 'ਪਰਿਵਾਰਾਂ ਲਈ ਸਿਹਤ ਬੀਮਾ ਯੋਜਨਾ',
      or: 'ପରିବାର ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ ବୀମା ଯୋଜନା',
      as: 'পৰিয়ালৰ বাবে স্বাস্থ্য বীমা আঁচনি',
      ur: 'خاندانوں کے لیے صحت کی بیمہ اسکیم'
    },
    category: 'health',
    benefitAmount: {
      en: '₹5 lakh per family',
      hi: '₹5 लाख प्रति परिवार',
      te: 'కుటుంబానికి ₹5 లక్షలు',
      ta: 'ஒரு குடும்பத்திற்கு ₹5 லட்சம்',
      bn: 'পরিবার প্রতি ₹5 লক্ষ',
      mr: '₹5 लाख प्रति कुटुंब',
      gu: 'પરિવાર દીઠ ₹5 લાખ',
      kn: 'ಪ್ರತಿ ಕುಟುಂಬಕ್ಕೆ ₹5 ಲಕ್ಷ',
      ml: 'കുടുംബത്തിന് ₹5 ലക്ഷം',
      pa: 'ਪਰਿਵਾਰ ਲਈ ₹5 ਲੱਖ',
      or: 'ପରିବାର ପ୍ରତି ₹5 ଲକ୍ଷ',
      as: 'পৰিয়াল প্ৰতি ₹5 লাখ',
      ur: 'خاندان کے لیے ₹5 لاکھ'
    },
    applicationUrl: 'https://pmjay.gov.in'
  },
  {
    id: 3,
    name: {
      en: 'Student Scholarship',
      hi: 'छात्रवृत्ति योजना',
      te: 'విద్యార్థి స్కాలర్‌షిప్',
      ta: 'மாணவர் உதவித்தொகை',
      bn: 'ছাত্রবৃত্তি',
      mr: 'विद्यार्थी शिष्यवृत्ती',
      gu: 'વિદ્યાર્થી શિષ્યવૃત્તિ',
      kn: 'ವಿದ್ಯಾರ್ಥಿ ವಿದ್ಯಾರ್ಥಿವೇತನ',
      ml: 'വിദ്യാർഥി സ്കോളർഷിപ്പ്',
      pa: 'ਵਿਦਿਆਰਥੀ ਸਕਾਲਰਸ਼ਿਪ',
      or: 'ଛାତ୍ର ଛାତ୍ରବୃତ୍ତି',
      as: 'ছাত্ৰ-ছাত্ৰী বৃত্তি',
      ur: 'طلباء وظیفہ'
    },
    description: {
      en: 'Financial assistance for students',
      hi: 'छात्रों के लिए वित्तीय सहायता',
      te: 'విద్యార్థులకు ఆర్థిక సహాయం',
      ta: 'மாணவர்களுக்கு நிதி உதவி',
      bn: 'শিক্ষার্থীদের আর্থিক সহায়তা',
      mr: 'विद्यार्थ्यांसाठी आर्थिक मदत',
      gu: 'વિદ્યાર્થીઓ માટે નાણાકીય સહાય',
      kn: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಆರ್ಥಿಕ ಸಹಾಯ',
      ml: 'വിദ്യാർത്ഥികൾക്ക് സാമ്പത്തിക സഹായം',
      pa: 'ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਵਿੱਤੀ ਸਹਾਇਤਾ',
      or: 'ଛାତ୍ରଛାତ୍ରୀଙ୍କ ପାଇଁ ଆର୍ଥିକ ସହାୟତା',
      as: 'ছাত্ৰ-ছাত্ৰীৰ বাবে আৰ্থিক সাহায্য',
      ur: 'طلباء کے لیے مالی امداد'
    },
    category: 'education',
    benefitAmount: {
      en: 'Up to ₹25,000',
      hi: '₹25,000 तक',
      te: '₹25,000 వరకు',
      ta: '₹25,000 வரை',
      bn: '₹25,000 পর্যন্ত',
      mr: '₹25,000 पर्यंत',
      gu: '₹25,000 સુધી',
      kn: '₹25,000 ವರೆಗೆ',
      ml: '₹25,000 വരെ',
      pa: '₹25,000 ਤੱਕ',
      or: '₹25,000 ପର୍ଯ୍ୟନ୍ତ',
      as: '₹25,000 পৰ্যন্ত',
      ur: '₹25,000 تک'
    },
    applicationUrl: 'https://scholarships.gov.in'
  },
  {
    id: 4,
    name: {
      en: 'Beti Bachao Beti Padhao',
      hi: 'बेटी बचाओ बेटी पढ़ाओ',
      te: 'బేటీ బచావో బేటీ పధావో',
      ta: 'பெண் குழந்தைகளை காப்பாற்று கல்வி கொடு',
      bn: 'বেটি বাচাও বেটি পড়াও',
      mr: 'बेटी बचाओ बेटी पढाओ',
      gu: 'બેટી બચાવો બેટી પઢાવો',
      kn: 'ಬೆಟೀ ಬಚಾವೋ ಬೆಟೀ ಪಢಾವೋ',
      ml: 'ബേട്ടി ബച്ചാവോ ബേട്ടി പഢാവോ',
      pa: 'ਬੇਟੀ ਬਚਾਓ ਬੇਟੀ ਪੜ੍ਹਾਓ',
      or: 'ବେଟୀ ବଚାଓ ବେଟୀ ପଢାଓ',
      as: 'বেটী বাচাও বেটী পঢ়াও',
      ur: 'بیٹی بچاؤ بیٹی پڑھاؤ'
    },
    description: {
      en: 'Scheme for girl child welfare and education',
      hi: 'बालिका कल्याण और शिक्षा योजना',
      te: 'బాలిక సంక్షేమం మరియు విద్య పథకం',
      ta: 'பெண் குழந்தை நலன் மற்றும் கல்வி திட்டம்',
      bn: 'কন্যা শিশু কল্যাণ ও শিক্ষা প্রকল্প',
      mr: 'मुलींच्या कल्याण आणि शिक्षण योजना',
      gu: 'બાળકીના કલ્યાણ અને શિક્ષણ યોજના',
      kn: 'ಹೆಣ್ಣು ಮಗುವಿನ ಕಲ್ಯಾಣ ಮತ್ತು ಶಿಕ್ಷಣ ಯೋಜನೆ',
      ml: 'പെൺകുട്ടികളുടെ ക്ഷേമവും വിദ്യാഭ്യാസവും',
      pa: 'ਕੁੜੀ ਭਲਾਈ ਅਤੇ ਸਿੱਖਿਆ ਯੋਜਨਾ',
      or: 'ବାଳିକା କଲ୍ୟାଣ ଓ ଶିକ୍ଷା ଯୋଜନା',
      as: 'ছোৱালী কল্যাণ আৰু শিক্ষা আঁচনি',
      ur: 'بچی کی فلاح اور تعلیم کی اسکیم'
    },
    category: 'women',
    benefitAmount: {
      en: 'Various benefits',
      hi: 'विभिन्न लाभ',
      te: 'వివిధ ప্রयোজনাలు',
      ta: 'பல்வேறு நன்मैகள்',
      bn: 'বিভিন্ন সুবিধা',
      mr: 'विविध फायदে',
      gu: 'વિવિધ લાभો',
      kn: 'ವಿವಿಧ ಪ್ರಯೋಜనগಳು',
      ml: 'വിവിധ ആनુকൂಲ്যങ്ങൾ',
      pa: 'ਵੱਖ-ਵੱখ ফাਇदে',
      or: 'ବିଭିନ্ন সুবিধা',
      as: 'বিভিন্ন সুবিধা',
      ur: 'مختلف فوائد'
    },
    applicationUrl: 'https://wcd.nic.in'
  }
];

// Quick actions with multilingual support
const quickActions = [
  { 
    id: 'eligibility', 
    title: {
      en: 'Check Eligibility',
      hi: 'पात्रता जांचें',
      te: 'అర్హত तनिखీ చేయండి',
      ta: 'தகুতियை சरिपാർক്கवും',
      bn: 'যোগ্যতা পরীক্ষা করুন',
      mr: 'पात्रता तपासा',
      gu: 'લાયકাત ચકાসો',
      kn: 'ಅರ್ಹতೆ ಪರಿಶೀಲಿಸಿ',
      ml: 'യോഗ്യത പരിശോധിക്കുক',
      pa: 'ਯੋਗতਾ ਜਾਂচੋ',
      or: 'ଯୋগ্যତা ଯাଞ୍ଚ କরନ୍ତୁ',
      as: 'যোগ্যতা পৰীক্ষা কৰক',
      ur: 'اہلیت چیک کریں'
    },
    icon: '✅' 
  },
  { 
    id: 'documents', 
    title: {
      en: 'Documents Needed',
      hi: 'आवश्यक दस्तावेज',
      te: 'అవసরమైన పত्राలు',
      ta: 'தேवैयான ஆवणങ্গൾ',
      bn: 'প্রয়োজনীয় কাগজপত্র',
      mr: 'आवश्यक कागदपत्रे',
      gu: 'જરૂری દસ્તાવેજો',
      kn: 'ಅಗತ್ಯ ದಾಖಲೆಗಳು',
      ml: 'ആവശ്യমായ രേഖകൾ',
      pa: 'ਲੋੜੀਂদে ਦਸਤਾਵੇਜ਼',
      or: 'ଆବଶ୍যક ଦଲିଲ',
      as: 'প্ৰয়োজনীয় নথি-পত্ৰ',
      ur: 'ضروری دستاویزات'
    },
    icon: '📄' 
  },
  { 
    id: 'offices', 
    title: {
      en: 'Nearby Offices',
      hi: 'नजदীকी कार्यালয',
      te: 'సమীप కార్యালయాలు',
      ta: 'அருகিலுள्ള அলুবলकങ্গൾ',
      bn: 'কাছাকাছি অফিস',
      mr: 'जवळील कार्यालये',
      gu: 'નજીકની ઑફિસો',
      kn: 'ಹತ್ತಿರದ ಕಚೇರಿಗಳು',
      ml: 'അടുത্തുള്ള ഓഫീസുകൾ',
      pa: 'ਨੇੜলे ਦফতর',
      or: 'ନিકଟস্থ କার্যাଳয',
      as: 'ওচৰৰ কাৰ্যালয়',
      ur: 'قریبی دفاتর'
    },
    icon: '📍' 
  },
  { 
    id: 'track', 
    title: {
      en: 'Track Application',
      hi: 'आवेदন ट्रैক करें',
      te: 'దরఖాস్তు ట্রాক్ చেయండი',
      ta: 'விண்ணপ্পত্তை কণ্কাণিক্কवும',
      bn: 'আবেদন ট্র্যাক করুন',
      mr: 'अर्ज ट्रॅক करा',
      gu: 'અરજી ટ્રૅક કરો',
      kn: 'ಅರ್ಜಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
      ml: 'അപേക്ഷ ട্রാক্ক് ચেয্যুক',
      pa: 'ਐਪਲੀਕੇਸ਼ਨ ਟ੍ਰੈਕ ਕਰੋ',
      or: 'ଆবেদন ଟ୍રাକ କরନ୍ତୁ',
      as: 'আবেদন ট্ৰেক কৰক',
      ur: 'درخواست ٹریک کریں'
    },
    icon: '🔍' 
  }
];

const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedSchemes, setSelectedSchemes] = useState<number[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [autoSubmitEnabled, setAutoSubmitEnabled] = useState(true);
  // Add these state variables after your existing useState declarations
  const [languageSwitchNotification, setLanguageSwitchNotification] = useState<{
  show: boolean;
  language: Language;
  confidence: number;
} | null>(null);

// Add the language detection service function
const showLanguageSwitchNotification = (detectedLang: Language, confidence: number) => {
  setLanguageSwitchNotification({
    show: true,
    language: detectedLang,
    confidence
  });
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    setLanguageSwitchNotification(null);
  }, 3000);
};


  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Enhanced speech recognition setup with auto-submit
  // Enhanced speech recognition with language detection
useEffect(() => {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.maxAlternatives = 3;
    
    // Start with current language but be ready to switch
    recognitionRef.current.lang = getLanguageCode(currentLanguage);

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      
      // Auto-detect language from speech
      const detection = LanguageDetectionService.detectLanguage(transcript);
      
      // Switch language if detection confidence is high and different from current
      if (detection.confidence > 0.7 && detection.language !== currentLanguage) {
        console.log(`🎯 Language detected: ${detection.language} (confidence: ${detection.confidence.toFixed(2)})`);
        setCurrentLanguage(detection.language);
        
        // Update speech recognition language for next time
        recognitionRef.current.lang = getLanguageCode(detection.language);
        
        // Show language switch notification
        showLanguageSwitchNotification(detection.language, detection.confidence);
      }
      
      setInputText(transcript);
      setIsListening(false);
      
      // Auto-submit after speech recognition if enabled
      if (autoSubmitEnabled && transcript.trim()) {
        setTimeout(() => {
          handleVoiceSubmit(transcript.trim());
        }, 500);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
  }

  return () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
  };
}, [currentLanguage, autoSubmitEnabled]);


  // Helper functions
  const getLanguageCode = (lang: Language): string => {
    const langMap: { [key in Language]: string } = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      pa: 'pa-IN',
      or: 'or-IN',
      as: 'as-IN',
      ur: 'ur-PK'
    };
    return langMap[lang] || 'en-US';
  };

  const getLocalizedText = (key: string, lang: Language): string => {
    return uiText[key]?.[lang] || uiText[key]?.['en'] || key;
  };

  const getSchemeText = (scheme: WelfareScheme, field: keyof WelfareScheme, lang: Language): string => {
    const fieldValue = scheme[field];
    if (typeof fieldValue === 'object' && fieldValue !== null) {
      return (fieldValue as LocalizedText)[lang] || (fieldValue as LocalizedText)['en'] || '';
    }
    return fieldValue as string || '';
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(currentLanguage);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Updated getResponse function with proper type safety
  const getResponse = (text: string, lang: Language): string => {
    const lowerText = text.toLowerCase();
    
    // Helper function to get response with fallback
    const getLocalizedResponse = (responses: Partial<LocalizedText>): string => {
      return responses[lang] || responses['en'] || responses['hi'] || 'Information not available';
    };
    
    // Agriculture schemes
    if (lowerText.includes('agriculture') || lowerText.includes('farmer') || lowerText.includes('किसान') || lowerText.includes('వ్యవసাయం') || lowerText.includes('రైতు')) {
      const responses: Partial<LocalizedText> = {
        en: 'Here are the agriculture schemes available: PM-KISAN provides ₹6,000 per year to small farmers. This scheme supports agricultural development and farmer welfare.',
        hi: 'यहाँ कृषि योजनाएं उपलब्ध हैं: PM-KISAN छोटे किसानों को प्रति वर्ष ₹6,000 प्रदान करता है। यह योजना कृषि विकास और किसान कल्याण का समर्थन करती है।',
        te: 'వ్యవసాయ పథకాలు ఇక్కడ ఉన్నాయి: PM-KISAN చిన్న రైతులకు సంవత్సరానికి ₹6,000 అందిస్తుంది. ఈ పథకం వ్యవసాయ అభివృద్ధి మరియు రైతు సంక్షేమానికి మద్దతు ఇస్తుంది।',
        ta: 'விवसाय திட্টങ्गൾ இங্गே உള्ளন: PM-KISAN சিறు விবসাযিকளুক্கু ஆண্டুक্কு ₹6,000 வழঙ্গুகিறது।'
      };
      return getLocalizedResponse(responses);
    }
    
    // Education schemes
    if (lowerText.includes('education') || lowerText.includes('scholarship') || lowerText.includes('छात्रवृत्ति') || lowerText.includes('విद্य') || lowerText.includes('স্কালর্‌షিপ্')) {
      const responses: Partial<LocalizedText> = {
        en: 'Education schemes available: Student Scholarships provide up to ₹25,000 for students. These schemes support educational development and student welfare.',
        hi: 'शिक्षा योजनाएं उपलब्ध हैं: छात्रवृत्ति छात्रों को ₹25,000 तक प्रदान करती है। ये योजनाएं शैक्षिक विकास और छात्र कल्याण का समर्थन करती हैं।',
        te: 'విद్যా পথকాলు అందুবাটులో ఉన్నాయి: విद্యার্থি স্কালর్‌షిप్‌లు విद্यার্থులకు ₹25,000 వরకు అందিస্তాయি। ఈ পথকাలు విद্যా అभివృద্ধি మরియు విద্యার্থি সংক্ষেমানికি మద্దতు ఇস্তాయি।',
        ta: 'கল্বি திট्टঙ্গൾ কিটైক্কின্রন: মাণবর উতবিত্তোকै মাণবরগளুক্কু ₹25,000 বরै বழঙ্গুকিরতু।'
      };
      return getLocalizedResponse(responses);
    }
    
    // Women empowerment schemes
    if (lowerText.includes('women') || lowerText.includes('mahila') || lowerText.includes('महिला') || lowerText.includes('মহিলা') || lowerText.includes('beti')) {
      const responses: Partial<LocalizedText> = {
        en: 'Women empowerment schemes: Beti Bachao Beti Padhao promotes girl child welfare and education. Stand Up India provides entrepreneurship opportunities for women.',
        hi: 'महिला सशक्तिकरण योजनाएं: बेटी बचाओ बेटी पढ़ाओ बालिका कल्याण और शिक्षा को बढ़ावा देती है। स्टैंड अप इंडिया महिलाओं को उद्यमिता के अवसर प्रदान करता है।',
        te: 'మহిళా సाধికারత পথকাలు: బেটী బচাবো బেটী পধাবো বালিক সংক্ষেমం মরియు বিদ্যను প্রোত্সাহিস্তুंদি। স্ট্যান্ড অপ ইন্ডিয়া মহিলালাকু ব্যাপার অবকাশালану అন্দিস্তুন্দি।',
        ta: 'পেণ্গঞ് উরিমैযળিপ্পু তিট্টঙ্গঞ্: পেঞ্ কুজন্তৈকলৈ কাপ্পার্রু কল্বি কোডু তিট্টম পেঞ্ কুজন্তৈ নলনৈ উক্কুবিক্কিরতু।'
      };
      return getLocalizedResponse(responses);
    }
    
    // Health schemes
    if (lowerText.includes('health') || lowerText.includes('स्বास्থ्य') || lowerText.includes('ఆরোগ্যం') || lowerText.includes('ayushman')) {
      const responses: Partial<LocalizedText> = {
        en: 'Health schemes available: Ayushman Bharat provides health insurance coverage of ₹5 lakh per family. This scheme ensures healthcare access for all.',
        hi: 'स्वास्थ्य योजनाएं उपलब्ध हैं: आयुष्मान भारत प्रति परिवार ₹5 लाख का स्वास्थ्य बीमा कवरेज प्रदान करता है। यह योजना सभी के लिए स्वास्थ्य सेवा की पहुंच सुनिश्चित करती है।',
        te: 'ఆরోগ্য పথকালু అందুবাটులো ఉన্নাযি: ఆযুষ্মান ভারত কুটুম্বানికি ₹5 లক্ষাল ఆরোগ্য বীমা কবরেজীని অন্দিস্তুন্দি। ఈ পথকం అन্দরికీ ఆরোগ্য সেবাল অন্দুবাটুনু নির্ধারিস্তুন্দি।',
        ta: 'সুকাতার তিট্টঙ্গঞ্ কিটৈক্কিন্রন: আযুষ્মান পারত ওরু কুডুম্বত্তিরক্কু ₹5 লট্সম সুকাতার কাপ্পীটু বলঙ্গুকিরতু।'
      };
      return getLocalizedResponse(responses);
    }
    
    // Default response
    const defaultResponses: Partial<LocalizedText> = {
      en: 'I can help you with government welfare schemes. You can ask about agriculture, education, women empowerment, health, housing, or employment schemes. What would you like to know?',
      hi: 'मैं सरकारी कल्याणकारी योजनाओं में आपकी सहायता कर सकता हूं। आप कृषि, शिक्षा, महिला सशक्तिकरण, स्वास्थ्य, आवास, या रोजगार योजनाओं के बारे में पूछ सकते हैं। आप क्या जानना चाहेंगे?',
      te: 'নেনু প্রভুত্ব সংક্ষেম পথকाললো মীকাকু সাহাయ্যম চেযగালনু। মীরু ব্যবসাযং, বিদ্য, মহিলা সাধীকারত, ঊরোগ্যং, গৃহনির্মাণম লেদা উদ্যোগ পথকাল গুরিঞ্চি আডগবচ্চু। মীরু এমি তেলুসুকোবালনুকুন্টুন্নারু?',
      ta: 'নান অরসাঙ্গ নল তিট্টঙ্গলিল নান উঙ্গলুক্কু উতব মুডিযুম। নীঙ্গঞ্ বিবসাযম, কল্বি, পেণ্গঞ্ উরিমৈযলিপ্পু, সুকাতারম, বীট্টুবসতি আল্লতু বেলৈবাযপ্পু তিট্টঙ্গলৈপ্ পর্রি কেট্কলাম।'
    };
    return getLocalizedResponse(defaultResponses);
  };

  const findRelevantSchemes = (text: string): WelfareScheme[] => {
    const lowerText = text.toLowerCase();
    return sampleSchemes.filter(scheme => {
      const schemeName = getSchemeText(scheme, 'name', currentLanguage).toLowerCase();
      const schemeDescription = getSchemeText(scheme, 'description', currentLanguage).toLowerCase();
      return schemeName.includes(lowerText) ||
             schemeDescription.includes(lowerText) ||
             scheme.category.toLowerCase().includes(lowerText);
    });
  };

  // Event handlers
  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(lang);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // New function to handle voice submission automatically
  const handleVoiceSubmit = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = getResponse(text, currentLanguage);
      const relevantSchemes = findRelevantSchemes(text);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: response,
        timestamp: new Date(),
        schemes: relevantSchemes.length > 0 ? relevantSchemes : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(response);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: getLocalizedText('errorMessage', currentLanguage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = getResponse(inputText, currentLanguage);
      const relevantSchemes = findRelevantSchemes(inputText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: response,
        timestamp: new Date(),
        schemes: relevantSchemes.length > 0 ? relevantSchemes : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(response);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: getLocalizedText('errorMessage', currentLanguage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  // Enhanced scheme click handler with detailed response
  const handleSchemeClick = (scheme: WelfareScheme) => {
    const isSelected = selectedSchemes.includes(scheme.id);
    if (isSelected) {
      setSelectedSchemes(prev => prev.filter(id => id !== scheme.id));
    } else {
      setSelectedSchemes(prev => [...prev, scheme.id]);
    }

    // Generate detailed scheme information
    const schemeDetails = getSchemeDetails(scheme, currentLanguage);
    
    const schemeMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      text: schemeDetails,
      timestamp: new Date(),
      schemes: [scheme]
    };

    setMessages(prev => [...prev, schemeMessage]);
    speakText(schemeDetails);
  };

  // New function to get detailed scheme information
  const getSchemeDetails = (scheme: WelfareScheme, lang: Language): string => {
    const schemeName = getSchemeText(scheme, 'name', lang);
    const description = getSchemeText(scheme, 'description', lang);
    const benefit = getSchemeText(scheme, 'benefitAmount', lang);
    
    const detailTemplates: Partial<LocalizedText> = {
      en: `Here are the complete details for ${schemeName}:

📋 Description: ${description}

💰 Benefit Amount: ${benefit}

📄 Required Documents:
• Aadhaar Card
• Bank Account Details
• Income Certificate
• Address Proof

✅ Eligibility Criteria:
• Indian Citizen
• Age: 18+ years
• Income based requirements apply

🌐 How to Apply:
1. Visit the official website
2. Fill the online application form
3. Upload required documents
4. Submit and take printout

📞 For help, contact your nearest Common Service Center or call the helpline.`,

      hi: `${schemeName} की पूरी जानकारी यहाँ है:

📋 विवरण: ${description}

💰 लाभ राशि: ${benefit}

📄 आवश्यक दस्तावेज:
• आधार कार्ड
• बैंक खाता विवरण
• आय प्रमाण पत्र
• पता प्रमाण

✅ पात्रता मानदंड:
• भारतीय नागरिक
• आयु: 18+ वर्ष
• आय आधारित आवश्यकताएं लागू

🌐 आवेदन कैसे करें:
1. आधिकारिक वेबसाइट पर जाएं
2. ऑनलाइन आवेदन फॉर्म भरें
3. आवश्यक दस्तावेज अपलोड करें
4. सबमिट करें और प्रिंट निकालें

📞 मदद के लिए, अपने निकटतम सामान्य सेवा केंद्र से संपर्क करें।`,

      te: `${schemeName} పूর্ণ বিবরালু ইক্কাডা উন্নাযি:

📋 বিবराণ: ${description}

💰 প্রযोজন মোত্তাম: ${benefit}

📄 আবসরমैন পত্রালু:
• ঊধার কার্ড
• ব্যাঙ্ক খাতা বিবরালু
• ঊদায ধৃবীকরণ পত্রম
• চিরুনামা রুজুবু

✅ আর্হত প্রমাণালু:
• ভারতীয পৌরুডু
• বযস্সু: 18+ সংবত্সরালু
• ঊদায ঊধারিত আবসরালু বর্তিস্তাযি

🌐 দরখাস্তু এলা চেযযালি:
1. আধিকারিক বেব‌সৈট্নু সন্দর্শিঞ্চন্ডি
2. ঊন‌লৈন দরখাস্তু ফارম পূরিঞ্চন্ডি
3. আবসরমैन পত্রালনু আপ‌লোড চেযন্ডি
4. সমর্পিঞ্চি প্রিন্ট তীসুকোন্ড

📞 সাহাযযম কোসাম, মী সমীপ কামন সর্বীস সেন্টর্নু সমপ্রদিঞ্চন্ডি।`
    };

    return detailTemplates[lang] || detailTemplates['en'] || `Details for ${schemeName}: ${description}. Benefit: ${benefit}`;
  };

  // Enhanced quick action handler with detailed responses
  const handleQuickAction = (actionId: string) => {
    const detailedActionTexts: { [key: string]: Partial<LocalizedText> } = {
      eligibility: {
        en: `📋 ELIGIBILITY CHECK GUIDE

To check if you're eligible for government schemes, I need the following information:

👤 Personal Details:
• Your age
• Monthly family income
• State/District you live in
• Occupation/profession
• Family size

📊 Based on this information, I can help you find:
• Agriculture schemes (if you're a farmer)
• Education scholarships (for students)
• Women empowerment programs
• Health insurance schemes
• Housing subsidies
• Employment/business loans

💡 Example: "I am 25 years old, farmer from Telangana, monthly income ₹15,000, family of 4 members"

Please share your details, and I'll find the best schemes for you!`,

        hi: `📋 पात्रता जांच गाइड

सरकारी योजनाओं के लिए आपकी पात्रता जांचने के लिए, मुझे निम्नलिखित जानकारी चाहिए:

👤 व्यक्तिगत विवरण:
• आपकी उम्र
• मासिक पारिवारिक आय
• राज्य/जिला जहाँ आप रहते हैं
• व्यवसाय/पेशा
• परिवार का आकार

📊 इस जानकारी के आधार पर, मैं आपको इन योजनाओं में मदद कर सकता हूं:
• कृषि योजनाएं (यदि आप किसान हैं)
• शिक्षा छात्रवृत्ति (छात्रों के लिए)
• महिला सशक्तिकरण कार्यक्रम
• स्वास्थ्य बीमा योजनाएं
• आवास सब्सिडी
• रोजगार/व्यापार ऋण

💡 उदाहरण: "मैं 25 साल का हूं, तेलंगाना का किसान, मासिक आय ₹15,000, 4 सदस्यों का परिवार"

कृपया अपना विवरण साझा करें, और मैं आपके लिए सबसे अच्छी योजनाएं ढूंढूंगा!`,

        te: `📋 আর্হত তনিখী গाইড

প্রভুত্ব পথকালাকু মী আর্हতनু তনিখী চেযডানিকি, নাকু ই ক্রিন্দি সমাচারম আবসরম:

👤 ব্যক্তিগত বিবরালু:
• মী বযস्सু
• নেলবারী কুটুম্ব ঊদাযম
• মীরু নিবসিঞ্চে রাষ্ট্রম/জিল্লা
• বৃত্তি/পেষা
• কুটুম্ব সভ্যুল সংখ্যা

📊 ই সমাচারম ঊধারংগা, নেনু মীকাকু ই পথকাললো সাহাযযম চেযগালনু:
• ব্যবসায পথカলু (মীরু রৈতু আযিতে)
• বিদ্যা স্কালর্‌ষিপ্‌লু (বিদ্যার্থুল কোসম)
• মহিলা সাধীকারত কার্যক্রমালু
• ঊরোগ্য বীমা পথকালু
• গৃহ সবসিডীলু
• উদ্যোগম/ব্যাপার রুণালু

💡 উদাহরণ: "নেনু 25 সংবত্সরালু, তেলংগাণ রৈতুনু, নেলবারী ঊদাযম ₹15,000, 4 সভ্যুল কুটুম্বম"

দযচেসি মী বিবরालনু পঞ্চুকোন্ডি, নেনু মী কোসম উত্তম পথকালনু কনুগোন্টানু!`
      },

      documents: {
        en: 'Documents required: Aadhaar Card, Bank Details, Income Certificate, Address Proof, Category Certificate (if applicable), Recent Photos, Mobile Number, Email ID.',
        hi: 'आवश्यक दस्तावेज: आधार कार्ड, बैंक विवरण, आय प्रमाण पत्र, पता प्रमाण, श्रेणी प्रमाण पत्र (यदि लागू हो), हाल की फोटो, मोबाइल नंबर, ईमेल आईडी।',
        te: 'আবসরমৈন পত্রালু: ঊधার কার্ড, ব্যাঙ্ক বিবরালু, ঊদায ধৃবীকরণ পত্রम, চিরুনামা রুজুবু, বর্গ ধৃবীকরণ পত্রালু (বর্তিঞ্চিনট্লযিতে), ইটীবলি ফোটোলু, মোবৈল নম্বর, ইমেযল ID।'
      },

      offices: {
        en: 'Government offices: Block Development Office (BDO), Tehsil Office, District Collector Office, Common Service Centers (CSCs), Digital Seva Centers, Banks, Employment Exchanges.',
        hi: 'सरकारी कार्यालय: ब्लॉक विकास कार्यालय (BDO), तहसील कार्यालय, जिला कलेक्टर कार्यालय, सामान्य सेवा केंद्र (CSCs), डिजिटल सेवा केंद्र, बैंक, रोजगार कार्यालय।',
        te: 'প্রभুত্ব কার্যালযালু: ব্লাক ডেবলপ্মেন্ট ঊফীস (BDO), তহসীল কার্যালযম, জিল্লা কলেক্টর কার্যালযম, কামন সর্বীস সেন্টর্লু (CSCs), ডিজিটল সেবা কেন্দ্রালু, ব্যাঙ্কুলু, উদ্যোগ কার্যালযালু।'
      },

      track: {
        en: 'Track applications online through official websites, mobile apps like UMANG, SMS services, or visit offices with your application reference number and Aadhaar.',
        hi: 'आधिकारिक वेबसाइटों, UMANG जैसे मोबाइल ऐप्स, SMS सेवाओं के माध्यम से ऑनलाइन आवेदन ट्रैक करें, या अपने आवेदन संदर्भ संख्या और आधार के साथ कार्यालयों में जाएं।',
        te: 'আধিকারিক বেব‌সৈট্লতো, UMANG అন্তা মোবৈল যাপ্লতো, SMS সেবালতো ঊন‌লৈন দরখাস্তুলনু ট্রাক চেযন্ডি, লেদা মী দরখাস্তু রিফরেন্স নম্বর মরিযু ঊধার্তো কার্যালযালাকু বेল্লন্ডি।'
      }
    };

    const responseText = detailedActionTexts[actionId]?.[currentLanguage] || detailedActionTexts[actionId]?.['en'] || 'Information not available';
    
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    speakText(responseText);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🏛️</span>
            <h1>Digital Welfare Companion</h1>
          </div>
          
          <div className="language-selector">
            <select 
              value={currentLanguage} 
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className="language-dropdown"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        </header>

{/* Main Content */}
<main className="main-content">
  <div className="welcome-section">
    <h2 className="main-title">{getLocalizedText('mainTitle', currentLanguage)}</h2>
  </div>

  {/* VOICE ASSISTANT AT TOP */}
  <div className="voice-assistant-section">
    <form onSubmit={handleSubmit} className="input-form">
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={getLocalizedText('inputPlaceholder', currentLanguage)}
          disabled={isLoading}
          className="text-input"
        />
        
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
          className={`voice-button ${isListening ? 'listening' : ''}`}
        >
          {isListening ? '🔴' : '🎤'}
        </button>
        
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </div>
      
      {isListening && (
        <div className="listening-indicator">
          <span className="pulse-dot"></span>
          <span className="listening-text">
            {getLocalizedText('listening', currentLanguage)}
          </span>
        </div>
      )}
    </form>
  </div>

  {/* Messages */}
  {messages.length > 0 && (
    <div className="messages-container">
      {messages.map(message => (
        <div key={message.id} className={`message ${message.type}`}>
          <div className="message-content">
            <p>{message.text}</p>
            {message.schemes && message.schemes.length > 0 && (
              <div className="message-schemes">
                {message.schemes.map(scheme => (
                  <div key={scheme.id} className="mini-scheme-card">
                    <h5>{getSchemeText(scheme, 'name', currentLanguage)}</h5>
                    <p>{getSchemeText(scheme, 'description', currentLanguage)}</p>
                    <span>{getSchemeText(scheme, 'benefitAmount', currentLanguage)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className="message-time">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
      {isLoading && (
        <div className="message assistant loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  )}

  {/* Quick Actions */}
  <div className="quick-actions">
    <h3>{getLocalizedText('quickActions', currentLanguage)}</h3>
    <div className="actions-grid">
      {quickActions.map(action => (
        <button 
          key={action.id} 
          className="action-button"
          onClick={() => handleQuickAction(action.id)}
        >
          <span className="action-icon">{action.icon}</span>
          <span className="action-title">{action.title[currentLanguage] || action.title['en']}</span>
        </button>
      ))}
    </div>
  </div>

  {/* Popular Schemes */}
  <div className="schemes-section">
    <h3>{getLocalizedText('popularSchemes', currentLanguage)}</h3>
    <div className="schemes-grid">
      {sampleSchemes.map(scheme => (
        <div 
          key={scheme.id}
          className={`scheme-card ${selectedSchemes.includes(scheme.id) ? 'selected' : ''}`}
          onClick={() => handleSchemeClick(scheme)}
        >
          <div className="scheme-header">
            <h4 className="scheme-title">{getSchemeText(scheme, 'name', currentLanguage)}</h4>
            <span className="scheme-category">{scheme.category}</span>
          </div>
          <p className="scheme-description">{getSchemeText(scheme, 'description', currentLanguage)}</p>
          <div className="scheme-footer">
            <span className="benefit-amount">{getSchemeText(scheme, 'benefitAmount', currentLanguage)}</span>
            {scheme.applicationUrl && (
              <a 
                href={scheme.applicationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="apply-link"
                onClick={(e) => e.stopPropagation()}
              >
                Apply Online
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
</main>
</div>
);
};
// Language Detection Service - Add this before the App component
interface DetectedLanguage {
  language: Language;
  confidence: number;
}

export default App;