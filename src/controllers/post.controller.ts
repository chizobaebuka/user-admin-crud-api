import { Response } from "express";
import Post from "../models/post.model";
import { RequestExt } from "../middleware/authenticate";

// Create a new post
const createPost = async (req: RequestExt, res: Response): Promise<void> => {
    try {
        const { content } = req.body;

        // Ensure req.user exists (type-safety check)
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not found in request.' });
            return;
        }

        const post = new Post({
            user: req.user.userId,
            content,
        });

        await post.save();

        res.status(201).json({
            message: 'Post created successfully.',
            status: 'success',
            data: post,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while creating the post.',
            status: 'error',
            error: error.message,
        });
    }
};

// Update an existing post
const updatePost = async (req: RequestExt, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        // Ensure req.user exists
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not found in request.' });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found.' });
            return;
        }

        // Check ownership
        if (post.user.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Not authorized to update this post.' });
            return;
        }

        post.content = content;
        await post.save();

        res.status(200).json({
            message: 'Post updated successfully.',
            status: 'success',
            data: post,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while updating the post.',
            status: 'error',
            error: error.message,
        });
    }
};

// Delete a post
const deletePost = async (req: RequestExt, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        // Ensure req.user exists
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized: User not found in request.' });
            return;
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: 'Post not found.' });
            return;
        }

        // Check ownership
        if (post.user.toString() !== req.user.userId) {
            res.status(403).json({ message: 'Not authorized to delete this post.' });
            return;
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            message: 'Post deleted successfully.',
            status: 'success',
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while deleting the post.',
            status: 'error',
            error: error.message,
        });
    }
};

// Get all posts (Optional)
const getPosts = async (req: RequestExt, res: Response): Promise<void> => {
    try {
        const posts = await Post.find().populate('user', 'email role'); // Populate user info
        res.status(200).json({
            message: 'Posts fetched successfully.',
            status: 'success',
            data: posts,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while fetching posts.',
            status: 'error',
            error: error.message,
        });
    }
};

// get single post
const getPostById = async (req: RequestExt, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('user', 'email role');
        if (!post) {
            res.status(404).json({ message: 'Post not found.' });
            return;
        }

        res.status(200).json({
            message: 'Post fetched successfully.',
            status: 'success',
            data: post,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while fetching the post.',
            status: 'error',
            error: error.message,
        });
    }
};

export { createPost, updatePost, deletePost, getPosts, getPostById };
