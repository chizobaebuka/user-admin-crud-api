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

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is a new post content."
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       401:
 *         description: Unauthorized.
 */
router.post('/create', authMiddleware, createPost);

/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Post]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Updated post content."
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       403:
 *         description: Not authorized to update this post.
 *       404:
 *         description: Post not found.
 */
router.put('/:postId', authMiddleware, updatePost);

/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       403:
 *         description: Not authorized to delete this post.
 *       404:
 *         description: Post not found.
 */
router.delete('/:postId', authMiddleware, deletePost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Posts fetched successfully.
 *       404:
 *         description: No posts found.
 *       500:
 *         description: An error occurred while fetching posts.
 */
router.get('/', getPosts);

/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to fetch
 *     responses:
 *       200:
 *         description: Post fetched successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: An error occurred while fetching the post.
 */
router.get('/:postId', getPostById);

export default router;
