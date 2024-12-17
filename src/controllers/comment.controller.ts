

import express, { Request, Response } from 'express';
import Comment from '../models/comment.model';
import { RequestExt } from '../middleware/authenticate';

const createComment = async (req: RequestExt, res: Response): Promise<void> => {
    const { content, postId } = req.body;

    const userId = req.user?.userId;

    try {
        const newComment = new Comment({
            userId: userId,
            postId,
            content,
        });

        await newComment.save();

        res.status(201).json({
            message: 'Comment created successfully.',
            status: 'success',
            comment: newComment,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Error creating comment.',
            error: error.message,
        });
    }
};

const getCommentsForPost = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            message: 'Comments retrieved successfully.',
            status: 'success',
            data: comments,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error retrieving comments.',
            error: error.message,
        });
    }
};

const updateComment = async (req: RequestExt, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId; // Assuming you have user authentication middleware

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found.' });
            return;
        }

        // Ensure the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            message: 'Comment updated successfully.',
            status: 'success',
            data: comment,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Error updating comment.',
            error: error.message,
        });
    }
};

const deleteComment = async (req: RequestExt, res: Response): Promise<void> => {
    const { commentId } = req.params;
    const userId = req.user?.userId;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found.' });
            return;
        }

        // Ensure the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        await comment.deleteOne();

        res.status(200).json({
            message: 'Comment deleted successfully.',
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error deleting comment.',
            error: error.message,
        });
    }
};

const getCommentById = async (req: Request, res: Response): Promise<void> => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found.' });
            return;
        }

        res.status(200).json({
            message: 'Comment retrieved successfully.',
            status: 'success',
            data: comment,
        });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error retrieving comment.',
            error: error.message,
        });
    }
};

export { createComment, getCommentsForPost, updateComment, deleteComment, getCommentById };

