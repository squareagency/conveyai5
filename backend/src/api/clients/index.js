// src/api/clients/index.js
import { Router } from 'express';
import { authenticateUser, validateTenant } from '../../middleware/auth';
import * as clientController from './client.controller';

const router = Router();

// Get all clients for current tenant
router.get('/', authenticateUser, validateTenant, clientController.getClients);

// Get a specific client
router.get('/:id', authenticateUser, validateTenant, clientController.getClient);

// Create a new client
router.post('/', authenticateUser, validateTenant, clientController.createClient);

// Update a client
router.put('/:id', authenticateUser, validateTenant, clientController.updateClient);

// Verify client identity
router.put('/:id/verify', authenticateUser, validateTenant, clientController.verifyClientIdentity);

export default router;