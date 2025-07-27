import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple test endpoint to check language handling
app.post('/api/test-language', (req, res) => {
  const { language, message } = req.body;
  
  console.log('=== LANGUAGE TEST ===');
  console.log('Received language:', language);
  console.log('Received message:', message);
  console.log('==================');
  
  // Simple language-based response
  const responses = {
    'en': 'Hello! I received your message in English.',
    'hi': 'नमस्ते! मुझे आपका संदेश हिंदी में मिला।',
    'te': 'హలో! మీ సందేశం తెలుగులో వచ్చింది।',
    'ta': 'வணக்கம்! உங்கள் செய்தி தமிழில் வந்தது।'
  };
  
  const response = responses[language as keyof typeof responses] || responses['hi'];
  
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
