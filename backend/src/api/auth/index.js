// src/api/auth/index.js
import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Request password reset
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

export default router;