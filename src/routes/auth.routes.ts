import express from 'express';
import { signUp, verifyEmail, login } from '../controllers/auth.controller';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

router.post('/signup', signUp);
router.post('/verify', verifyEmail);
router.post('/login', login);

export default router;