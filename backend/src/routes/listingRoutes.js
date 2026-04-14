import { Router } from 'express';
import { createListing, searchListings } from '../controllers/listingController.js';
import { allowRoles, authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', searchListings);
router.post('/', authRequired, allowRoles('owner', 'agent'), createListing);

export default router;
