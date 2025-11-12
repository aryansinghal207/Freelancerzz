import { Router } from 'express';
import { authenticate, requireClient } from '../middleware/auth.js';
import { 
  getClientInfo,
  listClientProjects,
  getClientProject,
  listClientProjectTasks,
  getClientWorkSessions,
  getClientInvoices,
  getClientInvoice,
  getClientDashboard,
  getClientTimeReport
} from '../controllers/clientPortal.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireClient); // Only clients can access this portal

router.get('/dashboard', getClientDashboard);
router.get('/info', getClientInfo);
router.get('/projects', listClientProjects);
router.get('/projects/:id', getClientProject);
router.get('/projects/:projectId/tasks', listClientProjectTasks);
router.get('/work-sessions', getClientWorkSessions);
router.get('/invoices', getClientInvoices);
router.get('/invoices/:id', getClientInvoice);
router.get('/time-report', getClientTimeReport);

export default router;
