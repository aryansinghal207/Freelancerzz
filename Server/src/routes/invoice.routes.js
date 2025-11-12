import { Router } from 'express';
import { authenticate, requireFreelancer } from '../middleware/auth.js';
import { createInvoiceFromRange, listInvoices, getInvoice, sendInvoiceEmail, deleteInvoice } from '../controllers/invoice.controller.js';

const router = Router();
router.use(authenticate);
router.use(requireFreelancer);

router.get('/', listInvoices);
router.get('/:id', getInvoice);
router.post('/create-from-range', createInvoiceFromRange);
router.post('/:id/send', sendInvoiceEmail);
router.delete('/:id', deleteInvoice);

export default router;


