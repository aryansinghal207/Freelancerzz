import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { listProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/project.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer);

router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;


