"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUserQuery = void 0;
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("../utils/prompts");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const processUserQuery = async (userQuery, language, conversationHistory, availableSchemes) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const systemPrompt = (0, prompts_1.getSystemPrompt)(language);
        const conversationContext = conversationHistory
            .slice(-4)
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');
        const languageNames = {
            'hi': 'Hindi (हिंदी)',
            'en': 'English',
            'te': 'Telugu (తెలుగు)',
            'ta': 'Tamil (தமிழ்)',
            'bn': 'Bengali (বাংলা)',
            'gu': 'Gujarati (ગુજરાતી)',
            'kn': 'Kannada (ಕನ್ನಡ)',
            'ml': 'Malayalam (മലയാളം)',
            'mr': 'Marathi (मराठी)',
            'or': 'Odia (ଓଡ଼ିଆ)',
            'pa': 'Punjabi (ਪੰਜਾਬੀ)',
            'ur': 'Urdu (اردو)'
        };
        const languageName = languageNames[language] || languageNames['hi'];
        const prompt = `${systemPrompt}

Previous conversation:
${conversationContext}

User query: ${userQuery}

IMPORTANT: You MUST respond ONLY in ${languageName}. Do not use any other language in your response. Be helpful and conversational while maintaining the specified language throughout your entire response.`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const extractedInfo = await extractUserInformation(userQuery, language);
        const suggestedSchemes = await findRelevantSchemes(userQuery, extractedInfo, availableSchemes);
        return {
            response,
            extractedInfo,
            suggestedSchemes
        };
    }
    catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to process query');
    }
};
exports.processUserQuery = processUserQuery;
const extractUserInformation = async (query, language) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Extract user information from this query in JSON format. Only include fields that are explicitly mentioned:
- age (number)
- income (monthly income in rupees)
- state (Indian state name)
- occupation (job/profession)
- familySize (number of family members)

Query: "${query}"
Language: ${language}

Respond with only valid JSON. Example: {"age": 25, "state": "Maharashtra"}`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleanJson = response.replace(/``````\n?/g, '').trim();
        return JSON.parse(cleanJson);
    }
    catch (error) {
        console.error('Error extracting user information:', error);
        return {};
    }
};
const findRelevantSchemes = async (query, userInfo, schemes) => {
    const keywords = query.toLowerCase();
    const relevantSchemes = [];
    schemes.forEach(scheme => {
        if (keywords.includes('किसान') || keywords.includes('farmer') || keywords.includes('agriculture')) {
            if (scheme.category === 'agriculture')
                relevantSchemes.push(scheme.id);
        }
        if (keywords.includes('छात्रवृत्ति') || keywords.includes('scholarship') || keywords.includes('education')) {
            if (scheme.category === 'education')
                relevantSchemes.push(scheme.id);
        }
        if (keywords.includes('घर') || keywords.includes('house') || keywords.includes('housing')) {
            if (scheme.category === 'housing')
                relevantSchemes.push(scheme.id);
        }
    });
    return relevantSchemes.slice(0, 3);
};
//# sourceMappingURL=geminiService.js.map