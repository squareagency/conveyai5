// src/api/title-searches/index.js
import { Router } from 'express';
import { authenticateUser, validateTenant } from '../../middleware/auth';
import * as titleSearchController from './title-search.controller';

const router = Router();

// Perform a title search
router.post('/', authenticateUser, validateTenant, titleSearchController.performTitleSearch);

// Get a specific title search
router.get('/:id', authenticateUser, validateTenant, titleSearchController.getTitleSearch);

export default router;