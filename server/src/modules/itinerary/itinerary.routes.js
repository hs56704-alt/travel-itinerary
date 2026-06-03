import { Router } from 'express';
import { generate, getAll, getOne, getShared, share } from './itinerary.controller.js';
import protect from '../../middlewares/auth.middleware.js';

const router = Router();


router.get('/share/:shareToken', getShared);

// Protected
router.use(protect);
router.post('/generate', generate);
router.get('/', getAll);
router.get('/:id', getOne);
router.patch('/:id/share', share);

export default router;