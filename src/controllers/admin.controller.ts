import { Response } from 'express';
import User from '../models/user.model';
import { RequestExt } from '../middleware/authenticate';
import { rateLimiter } from '../middleware/ratelimitter.middleware';

export const createAdminUser = async (req: RequestExt, res: Response): Promise<void> => {
    rateLimiter
    const { userId } = req.body;

    if (!userId) {
        res.status(400).send('User ID is required.');
        return;
    }

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).send('User not found.');
            return;
        }

        // Ensure the user isn't already an admin
        if (user.role === 'admin') {
            res.status(400).send('This user is already an admin.');
            return;
        }

        // Promote the user to admin
        user.role = 'admin';
        await user.save();

        // Return a success response with updated user details
        res.status(200).json({
            message: 'User role updated to admin successfully.',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error: any) {
        res.status(500).send(`An error occurred: ${error.message}`);
    }
};