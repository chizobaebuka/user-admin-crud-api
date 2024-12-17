import express from 'express';
import { createComment, getCommentsForPost, updateComment, deleteComment, getCommentById } from '../controllers/comment.controller';
import { authMiddleware } from '../middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management system
 */


router.post('/', authMiddleware, createComment); // Create a comment
router.get('/:postId', getCommentsForPost); // Get comments for a specific post
router.get('/:commentId', getCommentById); // Get a specific comment by ID
router.put('/:commentId', authMiddleware, updateComment); // Update a comment
router.delete('/:commentId', authMiddleware, deleteComment); // Delete a comment

export default router;
