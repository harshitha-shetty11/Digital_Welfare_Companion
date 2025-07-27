const { processUserQuery } = require('./dist/services/geminiService');
const { getSystemPrompt } = require('./dist/utils/prompts');

// Test language functionality
async function testLanguageHandling() {
  console.log('Testing language handling...');
  
  // Test different languages
  const testCases = [
    { language: 'en', query: 'Tell me about student schemes' },
    { language: 'te', query: 'Tell me about student schemes' },
    { language: 'hi', query: 'Tell me about student schemes' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n--- Testing ${testCase.language} ---`);
    console.log('System prompt:', getSystemPrompt(testCase.language).substring(0, 100) + '...');
    
    try {
      const response = await processUserQuery(testCase.query, testCase.language, [], []);
      console.log('Response:', response.response.substring(0, 200) + '...');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}

testLanguageHandling();
