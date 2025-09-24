import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { summary, groupByPeriod } from '../controllers/report.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/summary', summary);
router.get('/grouped', groupByPeriod);

export default router;


