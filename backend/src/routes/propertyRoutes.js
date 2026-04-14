import { Router } from 'express';
import { createProperty, getProperties, getPropertyById } from '../controllers/propertyController.js';
import { allowRoles, authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authRequired, allowRoles('owner', 'agent', 'admin'), createProperty);

export default router;
