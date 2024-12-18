import { Request, Response } from 'express';
import Comment from '../models/comment.model';
import { RequestExt } from '../middleware/authenticate';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import { rateLimiter } from '../middleware/ratelimitter.middleware';

const createComment = [
    rateLimiter,
    async (req: RequestExt, res: Response): Promise<void> => {
        const { content, postId } = req.body;
        const userId = req.user?.userId;

        try {
            logger.info('Comment creation attempt', { postId, userId });

            const newComment = new Comment({
                userId: userId,
                postId,
                content,
            });

            await newComment.save();

            logger.info('Comment created successfully', { postId, userId });

            res.status(201).json({
                message: 'Comment created successfully.',
                status: 'success',
                comment: newComment,
            });
        } catch (error: any) {
            logger.error('Error creating comment', { error: error.message, postId, userId });
            res.status(400).json({
                message: 'Error creating comment.',
                error: error.message,
            });
        }
    },
];

const getCommentsForPost = [
    rateLimiter,
    async (req: Request, res: Response): Promise<void> => {
        const { postId } = req.params;

        try {
            logger.info('Retrieving comments for post', { postId });

            const comments = await Comment.find({ postId })
                .sort({ createdAt: -1 }); // Sort by newest first

            logger.info('Comments retrieved successfully', { postId });

            res.status(200).json({
                message: 'Comments retrieved successfully.',
                status: 'success',
                data: comments,
            });
        } catch (error: any) {
            logger.error('Error retrieving comments', { error: error.message, postId });
            res.status(500).json({
                message: 'Error retrieving comments.',
                error: error.message,
            });
        }
    },
];

const updateComment = [
    rateLimiter,
    async (req: RequestExt, res: Response): Promise<void> => {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user?.userId;

        try {
            logger.info('Updating comment', { commentId, userId });

            const comment = await Comment.findById(commentId);

            if (!comment) {
                logger.warn('Comment not found', { commentId });
                res.status(404).json({ message: 'Comment not found.' });
                return;
            }

            if (comment.userId.toString() !== userId) {
                logger.warn('Unauthorized update attempt', { commentId, userId });
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }

            comment.content = content;
            await comment.save();

            logger.info('Comment updated successfully', { commentId, userId });

            res.status(200).json({
                message: 'Comment updated successfully.',
                status: 'success',
                data: comment,
            });
        } catch (error: any) {
            logger.error('Error updating comment', { error: error.message, commentId, userId });
            res.status(400).json({
                message: 'Error updating comment.',
                error: error.message,
            });
        }
    },
];

const deleteComment = [
    rateLimiter,
    async (req: RequestExt, res: Response): Promise<void> => {
        const { commentId } = req.params;
        const userId = req.user?.userId;

        try {
            logger.info('Deleting comment', { commentId, userId });

            const comment = await Comment.findById(commentId);

            if (!comment) {
                logger.warn('Comment not found', { commentId });
                res.status(404).json({ message: 'Comment not found.' });
                return;
            }

            if (comment.userId.toString() !== userId) {
                logger.warn('Unauthorized delete attempt', { commentId, userId });
                res.status(403).json({ message: 'Unauthorized' });
                return;
            }

            await comment.deleteOne();

            logger.info('Comment deleted successfully', { commentId, userId });

            res.status(200).json({
                message: 'Comment deleted successfully.',
            });
        } catch (error: any) {
            logger.error('Error deleting comment', { error: error.message, commentId, userId });
            res.status(500).json({
                message: 'Error deleting comment.',
                error: error.message,
            });
        }
    },
];

const getCommentById = [
    rateLimiter,
    async (req: Request, res: Response): Promise<void> => {
        const { commentId } = req.params;

        try {
            const trimmedCommentId = commentId.trim();

            if (!mongoose.Types.ObjectId.isValid(trimmedCommentId)) {
                logger.warn('Invalid comment ID', { commentId });
                res.status(400).json({ message: 'Invalid comment ID.' });
                return;
            }

            const comment = await Comment.findById(trimmedCommentId);

            if (!comment) {
                logger.warn('Comment not found', { commentId });
                res.status(404).json({ message: 'Comment not found.' });
                return;
            }

            logger.info('Comment retrieved successfully', { commentId });

            res.status(200).json({
                message: 'Comment retrieved successfully.',
                status: 'success',
                data: comment,
            });
        } catch (error: any) {
            logger.error('Error retrieving comment', { error: error.message, commentId });
            res.status(500).json({
                message: 'Error retrieving comment.',
                error: error.message,
            });
        }
    },
];

const getAllComments = [
    rateLimiter,
    async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('Retrieving all comments');

            const comments = await Comment.find();

            logger.info('All comments retrieved successfully');

            res.status(200).json({
                message: 'Comments retrieved successfully.',
                status: 'success',
                data: comments,
            });
        } catch (error: any) {
            logger.error('Error retrieving all comments', { error: error.message });
            res.status(500).json({
                message: 'Error retrieving comments.',
                error: error.message,
            });
        }
    },
];

export { createComment, getCommentsForPost, getAllComments, updateComment, deleteComment, getCommentById };
