import { Router } from 'express';
import { sendMessage, getMessages, markAsRead, getUnreadCount } from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/send', authenticate, sendMessage);
router.get('/client/:clientId', authenticate, getMessages);
router.post('/client/:clientId/read', authenticate, markAsRead);
router.get('/unread-count', authenticate, getUnreadCount);

export default router;
