import express from 'express';
import { authMiddleware, checkRoles } from '../middleware';
import { createAdminUser } from '../controllers/admin.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management 
 */

// Only admins can access this route
router.post('/create-admin', authMiddleware, checkRoles(['admin']), createAdminUser);

export default router;
