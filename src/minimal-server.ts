import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3002; // Use different port to avoid conflicts

app.use(cors());
app.use(express.json());

// Simple chat endpoint that properly handles language
app.post('/api/chat', (req, res) => {
  const { message, language = 'hi', conversationHistory = [] } = req.body;
  
  console.log('=== CHAT REQUEST ===');
  console.log('Language:', language);
  console.log('Message:', message);
  console.log('===================');
  
  // Language-specific responses for testing
  const responses = {
    'en': `I understand you're asking about "${message}". Here's information about student welfare schemes in English. The government provides various scholarships and financial assistance programs for students from different backgrounds.`,
    
    'hi': `मैं समझ गया कि आप "${message}" के बारे में पूछ रहे हैं। यहाँ छात्र कल्याणकारी योजनाओं की जानकारी है। सरकार विभिन्न पृष्ठभूमि के छात्रों के लिए कई छात्रवृत्ति और वित्तीय सहायता कार्यक्रम प्रदान करती है।`,
    
    'te': `మీరు "${message}" గురించి అడుగుతున్నారని నేను అర్థం చేసుకున్నాను. ఇక్కడ విద్యార్థి సంక్షేమ పథకాల గురించి సమాచారం ఉంది. ప్రభుత్వం వివిధ నేపథ్యాల నుండి వచ్చిన విద్యార్థులకు అనేక స్కాలర్‌షిప్‌లు మరియు ఆర్థిక సహాయ కార్యక్రమాలను అందిస్తుంది.`,
    
    'ta': `நீங்கள் "${message}" பற்றி கேட்கிறீர்கள் என்று நான் புரிந்துகொள்கிறேன். இங்கே மாணவர் நலத் திட்டங்கள் பற்றிய தகவல் உள்ளது. அரசாங்கம் பல்வேறு பின்னணியிலிருந்து வரும் மாணவர்களுக்கு பல்வேறு உதவித்தொகைகள் மற்றும் நிதி உதவி திட்டங்களை வழங்குகிறது.`,
    
    'bn': `আমি বুঝতে পারছি আপনি "${message}" সম্পর্কে জিজ্ঞাসা করছেন। এখানে ছাত্র কল্যাণ প্রকল্প সম্পর্কে তথ্য রয়েছে। সরকার বিভিন্ন পটভূমির ছাত্রদের জন্য বিভিন্ন বৃত্তি এবং আর্থিক সহায়তা কর্মসূচি প্রদান করে।`,
    
    'gu': `હું સમજી ગયો કે તમે "${message}" વિશે પૂછી રહ્યા છો. અહીં વિદ્યાર્થી કલ્યાણ યોજનાઓ વિશે માહિતી છે. સરકાર વિવિધ પૃષ્ઠભૂમિના વિદ્યાર્થીઓ માટે વિવિધ શિષ્યવૃત્તિ અને નાણાકીય સહાયતા કાર્યક્રમો પ્રદાન કરે છે.`,
    
    'kn': `ನೀವು "${message}" ಬಗ್ಗೆ ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ಇಲ್ಲಿ ವಿದ್ಯಾರ್ಥಿ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ಇದೆ. ಸರ್ಕಾರವು ವಿವಿಧ ಹಿನ್ನೆಲೆಯ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿವಿಧ ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಆರ್ಥಿಕ ಸಹಾಯ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.`,
    
    'ml': `നിങ്ങൾ "${message}" എന്നതിനെക്കുറിച്ച് ചോദിക്കുന്നുണ്ടെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു. ഇവിടെ വിദ്യാർത്ഥി ക്ഷേമ പദ്ധതികളെക്കുറിച്ചുള്ള വിവരങ്ങളുണ്ട്. സർക്കാർ വിവിധ പശ്ചാത്തലത്തിൽ നിന്നുള്ള വിദ്യാർത്ഥികൾക്ക് വിവിധ സ്കോളർഷിപ്പുകളും സാമ്പത്തിക സഹായ പരിപാടികളും നൽകുന്നു.`,
    
    'mr': `तुम्ही "${message}" बद्दल विचारत आहात हे मला समजले आहे. येथे विद्यार्थी कल्याण योजनांची माहिती आहे. सरकार विविध पार्श्वभूमीतील विद्यार्थ्यांसाठी विविध शिष्यवृत्ती आणि आर्थिक सहाय्य कार्यक्रम प्रदान करते.`,
    
    'or': `ମୁଁ ବୁଝିପାରୁଛି ଯେ ଆପଣ "${message}" ବିଷୟରେ ପଚାରୁଛନ୍ତି। ଏଠାରେ ଛାତ୍ର କଲ୍ୟାଣ ଯୋଜନା ବିଷୟରେ ସୂଚନା ଅଛି। ସରକାର ବିଭିନ୍ନ ପୃଷ୍ଠଭୂମିର ଛାତ୍ରମାନଙ୍କ ପାଇଁ ବିଭିନ୍ନ ଛାତ୍ରବୃତ୍ତି ଏବଂ ଆର୍ଥିକ ସହାୟତା କାର୍ଯ୍ୟକ୍ରମ ପ୍ରଦାନ କରନ୍ତି।`,
    
    'pa': `ਮੈਂ ਸਮਝ ਗਿਆ ਕਿ ਤੁਸੀਂ "${message}" ਬਾਰੇ ਪੁੱਛ ਰਹੇ ਹੋ। ਇੱਥੇ ਵਿਦਿਆਰਥੀ ਕਲਿਆਣ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਹੈ। ਸਰਕਾਰ ਵੱਖ-ਵੱਖ ਪਿਛੋਕੜ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਵੱਖ-ਵੱਖ ਸਕਾਲਰਸ਼ਿਪ ਅਤੇ ਵਿੱਤੀ ਸਹਾਇਤਾ ਪ੍ਰੋਗਰਾਮ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ।`,
    
    'ur': `میں سمجھ گیا کہ آپ "${message}" کے بارے میں پوچھ رہے ہیں۔ یہاں طلباء کی فلاحی اسکیموں کی معلومات ہیں۔ حکومت مختلف پس منظر کے طلباء کے لیے مختلف وظائف اور مالی امداد کے پروگرام فراہم کرتی ہے۔`
  };
  
  const response = responses[language as keyof typeof responses] || responses['hi'];
  
  res.json({
    response,
    schemes: [],
    sessionId: 'test-session',
    extractedInfo: {},
    debug: {
      receivedLanguage: language,
      selectedResponse: language in responses ? language : 'hi (fallback)'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Minimal server running for language testing'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
