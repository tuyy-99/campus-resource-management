import { Router } from 'express';
import * as resourceController from '../controllers/resourceController';
import { authenticate } from '../middleware/authenticate';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.get('/', resourceController.list);
router.get('/:id', resourceController.getById);

router.use(authenticate);
router.use(requireRole('ADMIN'));

router.post('/', resourceController.createValidation, resourceController.create);
router.patch('/:id', resourceController.updateValidation, resourceController.update);
router.delete('/:id', resourceController.remove);

export default router;
