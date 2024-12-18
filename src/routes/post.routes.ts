import express from 'express';
import {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPostById,
} from '../controllers/post.controller';
import { authMiddleware } from '../middleware/authenticate';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

router.post('/create', authMiddleware, createPost);
router.put('/:postId', authMiddleware, updatePost);
router.delete('/:postId', authMiddleware, deletePost);
router.get('/', getPosts);
router.get('/:postId', authMiddleware, getPostById);

export default router;
