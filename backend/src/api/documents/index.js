// src/api/documents/index.js
import { Router } from 'express';
import { authenticateUser, validateTenant } from '../../middleware/auth';
import * as documentController from './document.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Upload a document
router.post('/', 
  authenticateUser, 
  validateTenant, 
  upload.single('file'), 
  documentController.uploadDocument
);

// Get a document
router.get('/:id', authenticateUser, validateTenant, documentController.getDocument);

// Update a document
router.put('/:id', authenticateUser, validateTenant, documentController.updateDocument);

// Delete a document
router.delete('/:id', authenticateUser, validateTenant, documentController.deleteDocument);

export default router;