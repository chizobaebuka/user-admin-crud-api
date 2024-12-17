import { Response, NextFunction } from "express";
import { RequestExt } from "./authenticate";

export const checkRoles = (roles: string[]) => {
    return (req: RequestExt, res: Response, next: NextFunction): void => {
        if (!roles.includes(req.user!.role)) {
            res.status(403).json({ message: 'Forbidden: You do not have the permission to access this resource' });
            return;
        }

        next();
    };
};
