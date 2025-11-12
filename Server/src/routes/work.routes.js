import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { startTimer, stopTimer, manualLog, listSessions, deleteSession } from '../controllers/work.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer);

router.get('/', listSessions);
router.post('/start', startTimer);
router.post('/manual', manualLog);
router.post('/:id/stop', stopTimer);
router.delete('/:id', deleteSession);

export default router;


