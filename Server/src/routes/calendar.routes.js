import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { daily, weekly, monthly } from '../controllers/calendar.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer);

router.get('/daily', daily);
router.get('/weekly', weekly);
router.get('/monthly', monthly);

export default router;


