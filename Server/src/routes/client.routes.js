import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { listClients, createClient, getClient, updateClient, deleteClient } from '../controllers/client.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer); // Only freelancers can manage clients

router.get('/', listClients);
router.post('/', createClient);
router.get('/:id', getClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;


