import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer);

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;


