import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { summary, groupByPeriod } from '../controllers/report.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer);

router.get('/summary', summary);
router.get('/grouped', groupByPeriod);

export default router;


