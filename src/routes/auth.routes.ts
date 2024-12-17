import express from 'express';
import { signUp, verifyEmail, login } from '../controllers/auth.controller';
import { authMiddleware, checkRoles } from '../middleware';

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
router.get('/profile', authMiddleware, checkRoles(['user']), (req, res) => {
    res.json({ message: 'You have access to this route' });
});

export default router;