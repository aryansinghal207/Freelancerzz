import { Router } from 'express';
import { register, login, inviteClient, registerClient } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/invite-client', authenticate, inviteClient);
router.post('/register-client', registerClient);

export default router;


