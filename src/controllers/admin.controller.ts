import { Response } from "express";
import { RequestExt } from "../middleware/authenticate";
import { rateLimiter } from "../middleware/ratelimitter.middleware";
import logger from "../utils/logger";
import User from "../models/user.model";


// Apply the rate limiter middleware
export const createAdminUser = [
    rateLimiter,
    async (req: RequestExt, res: Response): Promise<void> => {
        const { userId } = req.body;

        // Log the incoming request
        logger.info('Attempt to promote user to admin', { userId, endpoint: req.originalUrl });

        if (!userId) {
            logger.warn('Missing User ID in request body');
            res.status(400).send('User ID is required.');
            return;
        }

        try {
            // Find the user by their ID
            const user = await User.findById(userId);

            if (!user) {
                logger.warn('User not found', { userId });
                res.status(404).send('User not found.');
                return;
            }

            // Ensure the user isn't already an admin
            if (user.role === 'admin') {
                logger.info('User is already an admin', { userId, email: user.email });
                res.status(400).send('This user is already an admin.');
                return;
            }

            // Promote the user to admin
            user.role = 'admin';
            await user.save();

            // Log the successful promotion
            logger.info('User promoted to admin successfully', {
                userId: user._id,
                email: user.email,
            });

            // Return a success response with updated user details
            res.status(200).json({
                message: 'User role updated to admin successfully.',
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error: any) {
            logger.error('Error promoting user to admin', {
                error: error.message,
                userId,
            });
            res.status(500).send(`An error occurred: ${error.message}`);
        }
    },
];
