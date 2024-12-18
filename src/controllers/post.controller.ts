import { Response } from "express";
import Post from "../models/post.model";
import { RequestExt } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/ratelimitter.middleware";
import logger from "../utils/logger";

// Create a new post
const createPost = [
    rateLimiter,
    async (req: RequestExt, res: Response): Promise<void> => {
        try {
            const { content } = req.body;

            // Ensure req.user exists and has a userId
            if (!req.user || !req.user.userId) {
                logger.warn("Unauthorized: User not found in request", { userId: req.user?.userId });
                res.status(401).json({ message: "Unauthorized: User not found in request." });
                return;
            }

            const post = new Post({
                user: req.user.userId,
                content,
            });

            await post.save();

            logger.info("Post created successfully", { postId: post._id, userId: req.user.userId });

            res.status(201).json({
                message: "Post created successfully.",
                status: "success",
                data: post,
            });
        } catch (error: any) {
            logger.error("Error creating post", { error: error.message, userId: req.user?.userId });
            res.status(500).json({
                message: "An error occurred while creating the post.",
                status: "error",
                error: error.message,
            });
        }
    },
];

// Update an existing post
const updatePost = [
    rateLimiter, // Apply rate limiter to this route
    async (req: RequestExt, res: Response): Promise<void> => {
        try {
            const { postId } = req.params;
            const { content } = req.body;

            // Ensure req.user exists and userId is available
            if (!req.user || !req.user.userId) {
                logger.warn("Unauthorized: User not found in request", { userId: req.user?.userId });
                res.status(401).json({ message: 'Unauthorized: User not found in request.' });
                return;
            }

            const post = await Post.findById(postId);
            if (!post) {
                logger.info("Post not found", { postId });
                res.status(404).json({ message: 'Post not found.' });
                return;
            }

            // Check ownership
            if (post.user.toString() !== req.user.userId) {
                logger.warn("Unauthorized update attempt", { postId, userId: req.user.userId });
                res.status(403).json({ message: 'Not authorized to update this post.' });
                return;
            }

            post.content = content;
            await post.save();

            logger.info("Post updated successfully", { postId, userId: req.user.userId });

            res.status(200).json({
                message: 'Post updated successfully.',
                status: 'success',
                data: post,
            });
        } catch (error: any) {
            logger.error("Error updating post", { error: error.message, postId: req.params.postId, userId: req.user?.userId });
            res.status(500).json({
                message: 'An error occurred while updating the post.',
                status: 'error',
                error: error.message,
            });
        }
    }
];

// Delete a post
const deletePost = [
    rateLimiter, // Apply rate limiter to this route
    async (req: RequestExt, res: Response): Promise<void> => {
        try {
            const { postId } = req.params;

            // Ensure req.user exists and userId is available
            if (!req.user || !req.user.userId) {
                logger.warn("Unauthorized: User not found in request", { userId: req.user?.userId });
                res.status(401).json({ message: 'Unauthorized: User not found in request.' });
                return;
            }

            const post = await Post.findById(postId);
            if (!post) {
                logger.info("Post not found", { postId });
                res.status(404).json({ message: 'Post not found.' });
                return;
            }

            // Check ownership
            if (post.user.toString() !== req.user.userId) {
                logger.warn("Unauthorized delete attempt", { postId, userId: req.user.userId });
                res.status(403).json({ message: 'Not authorized to delete this post.' });
                return;
            }

            await Post.findByIdAndDelete(postId);

            logger.info("Post deleted successfully", { postId, userId: req.user.userId });

            res.status(200).json({
                message: 'Post deleted successfully.',
                status: 'success',
            });
        } catch (error: any) {
            logger.error("Error deleting post", { error: error.message, postId: req.params.postId, userId: req.user?.userId });
            res.status(500).json({
                message: 'An error occurred while deleting the post.',
                status: 'error',
                error: error.message,
            });
        }
    }
];

// Get all posts (Optional)
const getPosts = [
    rateLimiter, 
    async (req: RequestExt, res: Response): Promise<void> => {
        try {
            const posts = await Post.find().populate('user', 'email role'); // Populate user info
            logger.info("Posts fetched successfully", { postsCount: posts.length });

            res.status(200).json({
                message: 'Posts fetched successfully.',
                status: 'success',
                data: posts,
            });
        } catch (error: any) {
            logger.error("Error fetching posts", { error: error.message });
            res.status(500).json({
                message: 'An error occurred while fetching posts.',
                status: 'error',
                error: error.message,
            });
        }
    }
];

// get single post
const getPostById = [
    rateLimiter, 
    async (req: RequestExt, res: Response): Promise<void> => {
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId).populate('user', 'email role');
            if (!post) {
                logger.info("Post not found", { postId });
                res.status(404).json({ message: 'Post not found.' });
                return;
            }

            logger.info("Post fetched successfully", { postId });

            res.status(200).json({
                message: 'Post fetched successfully.',
                status: 'success',
                data: post,
            });
        } catch (error: any) {
            logger.error("Error fetching post", { error: error.message, postId: req.params.postId });
            res.status(500).json({
                message: 'An error occurred while fetching the post.',
                status: 'error',
                error: error.message,
            });
        }
    }
];


export { createPost, updatePost, deletePost, getPosts, getPostById };
