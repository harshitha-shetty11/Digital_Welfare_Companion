"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processChatMessage = void 0;
const geminiService_1 = require("../services/geminiService");
const databaseService_1 = require("../services/databaseService");
const crypto_1 = __importDefault(require("crypto"));
const processChatMessage = async (req, res) => {
    try {
        const { message, language = 'hi', conversationHistory = [], sessionId } = req.body;
        console.log('=== CHAT REQUEST DEBUG ===');
        console.log('Received language:', language);
        console.log('Message:', message);
        console.log('Full request body:', JSON.stringify(req.body, null, 2));
        console.log('========================');
        if (!message || typeof message !== 'string') {
            res.status(400).json({ error: 'Message is required' });
            return;
        }
        const currentSessionId = sessionId || crypto_1.default.randomUUID();
        const availableSchemes = await (0, databaseService_1.getAllSchemes)();
        const chatResponse = await (0, geminiService_1.processUserQuery)(message, language, conversationHistory, availableSchemes);
        let schemes = [];
        if (chatResponse.suggestedSchemes && chatResponse.suggestedSchemes.length > 0) {
            const schemeIds = chatResponse.suggestedSchemes.map((id) => String(id));
            schemes = await (0, databaseService_1.getSchemesByIds)(schemeIds, language);
        }
        res.json({
            response: chatResponse.response,
            schemes,
            sessionId: currentSessionId,
            extractedInfo: chatResponse.extractedInfo
        });
    }
    catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({
            error: 'क्षमा करें, कुछ तकनीकी समस्या है। कृपया बाद में कोशिश करें।',
            errorCode: 'PROCESSING_ERROR'
        });
    }
};
exports.processChatMessage = processChatMessage;
//# sourceMappingURL=chatController.js.map