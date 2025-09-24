import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', listTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;


