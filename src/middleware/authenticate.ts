import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Request } from 'express';
import dotenv from 'dotenv';
import { IUser } from '../interface/auth.interface';

dotenv.config();

export interface RequestExt extends Request {
    user?: {
        userId: string;
        role: string;
    };
}

export const authMiddleware = (req: RequestExt, res: Response, next: NextFunction): void => {
    try {
        // Get the Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized: No token provided' });
            return;
        }

        // Extract the token (after 'Bearer ')
        const token = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };

        // Attach the decoded user info to the request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
