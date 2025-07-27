"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const chat_1 = __importDefault(require("./routes/chat"));
const schemes_1 = __importDefault(require("./routes/schemes"));
const database_1 = require("./database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/chat', chat_1.default);
app.use('/api/schemes', schemes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.post('/api/test-language', (req, res) => {
    const { language = 'hi', message } = req.body;
    console.log('=== LANGUAGE TEST ===');
    console.log('Received language:', language);
    console.log('Received message:', message);
    console.log('==================');
    const responses = {
        'en': 'Hello! I understand you want to know about welfare schemes. How can I help you?',
        'hi': 'नमस्ते! मैं समझ गया कि आप कल्याणकारी योजनाओं के बारे में जानना चाहते हैं। मैं आपकी कैसे सहायता कर सकता हूं?',
        'te': 'హలో! మీరు సంక్షేమ పథకాల గురించి తెలుసుకోవాలని అనుకుంటున్నారని నేను అర్థం చేసుకున్నాను. నేను మీకు ఎలా సహాయం చేయగలను?',
        'ta': 'வணக்கம்! நீங்கள் நலத்திட்டங்களைப் பற்றி அறிய விரும்புகிறீர்கள் என்று நான் புரிந்துகொள்கிறேன். நான் உங்களுக்கு எப்படி உதவ முடியும்?',
        'bn': 'হ্যালো! আমি বুঝতে পারছি আপনি কল্যাণ প্রকল্প সম্পর্কে জানতে চান। আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
        'gu': 'હેલો! હું સમજી ગયો કે તમે કલ્યાણ યોજનાઓ વિશે જાણવા માંગો છો. હું તમારી કેવી રીતે મદદ કરી શકું?',
        'kn': 'ಹಲೋ! ನೀವು ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತಿಳಿದುಕೊಳ್ಳಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
        'ml': 'ഹലോ! നിങ്ങൾ ക്ഷേമ പദ്ധതികളെക്കുറിച്ച് അറിയാൻ ആഗ്രഹിക്കുന്നുവെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു. എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും?',
        'mr': 'हॅलो! तुम्हाला कल्याण योजनांबद्दल जाणून घ्यायचे आहे हे मला समजले. मी तुमची कशी मदत करू शकतो?',
        'or': 'ହେଲୋ! ମୁଁ ବୁଝିପାରୁଛି ଯେ ଆପଣ କଲ୍ୟାଣ ଯୋଜନା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି। ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
        'pa': 'ਹੈਲੋ! ਮੈਂ ਸਮਝ ਗਿਆ ਕਿ ਤੁਸੀਂ ਕਲਿਆਣ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
        'ur': 'ہیلو! میں سمجھ گیا کہ آپ فلاحی اسکیموں کے بارے میں جاننا چاہتے ہیں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟'
    };
    const response = responses[language] || responses['hi'];
    res.json({
        response,
        language,
        message: 'Language test successful - response should be in selected language'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
(0, database_1.connectDB)().then(() => {
    console.log('✅ MongoDB connection established.');
}).catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
});
exports.default = app;
//# sourceMappingURL=app.js.map