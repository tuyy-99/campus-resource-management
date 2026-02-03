import { Router } from 'express';
import * as requestController from '../controllers/requestController';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.use(authenticate);

router.get('/', requestController.list);
router.post('/', requestController.createValidation, requestController.create);

router.post('/:id/approve', requireRole('ADMIN'), requestController.approve);
router.post('/:id/reject', requireRole('ADMIN'), requestController.reject);

router.get('/:id', requestController.getById);
router.patch('/:id', requestController.updateValidation, requestController.update);
router.delete('/:id', requestController.remove);

export default router;
