import { Request, Response } from 'express';
import { processUserQuery } from '../services/geminiService';
import { getSchemesByIds, getAllSchemes } from '../services/databaseService';
import crypto from 'crypto';

export const processChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, language = 'hi', conversationHistory = [], sessionId } = req.body;
    
    // Debug logging
    console.log('=== CHAT REQUEST DEBUG ===');
    console.log('Received language:', language);
    console.log('Message:', message);
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('========================');

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const currentSessionId = sessionId || crypto.randomUUID();

    const availableSchemes = await getAllSchemes();

    const chatResponse = await processUserQuery(message, language, conversationHistory, availableSchemes);

    let schemes: any[] = [];
    if (chatResponse.suggestedSchemes && chatResponse.suggestedSchemes.length > 0) {
      // Convert suggested schemes to string array if they're numbers
      const schemeIds = chatResponse.suggestedSchemes.map((id: any) => String(id));
      schemes = await getSchemesByIds(schemeIds, language);
    }

    res.json({
      response: chatResponse.response,
      schemes,
      sessionId: currentSessionId,
      extractedInfo: chatResponse.extractedInfo
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({
      error: 'क्षमा करें, कुछ तकनीकी समस्या है। कृपया बाद में कोशिश करें।',
      errorCode: 'PROCESSING_ERROR'
    });
  }
};
