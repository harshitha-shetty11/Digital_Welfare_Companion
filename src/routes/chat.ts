import { Router } from 'express';
import { processChatMessage } from '../controllers/chatController';

const router = Router();

// POST /api/chat - Process a chat message
router.post('/', processChatMessage);

export default router;
