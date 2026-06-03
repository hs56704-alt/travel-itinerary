import { Router } from 'express';
import { uploadDocument, getDocuments, removeDocument } from './upload.controller.js';
import protect from '../../middlewares/auth.middleware.js';
import upload from '../../middlewares/upload.middleware.js';

const router = Router();


router.use(protect);

router.post('/', upload.array('documents', 5), uploadDocument);
router.get('/', getDocuments);
router.delete('/:id', removeDocument);

export default router;