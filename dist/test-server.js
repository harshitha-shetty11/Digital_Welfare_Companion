"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/test-language', (req, res) => {
    const { language, message } = req.body;
    console.log('=== LANGUAGE TEST ===');
    console.log('Received language:', language);
    console.log('Received message:', message);
    console.log('==================');
    const responses = {
        'en': 'Hello! I received your message in English.',
        'hi': 'नमस्ते! मुझे आपका संदेश हिंदी में मिला।',
        'te': 'హలో! మీ సందేశం తెలుగులో వచ్చింది।',
        'ta': 'வணக்கம்! உங்கள் செய்தி தமிழில் வந்தது।'
    };
    const response = responses[language] || responses['hi'];
    res.json({
        response,
        receivedLanguage: language,
        message: 'Language test successful'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Test server running on port ${PORT}`);
    console.log(`Test endpoint: http://localhost:${PORT}/api/test-language`);
});
//# sourceMappingURL=test-server.js.map