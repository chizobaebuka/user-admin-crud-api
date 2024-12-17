import jwt from 'jsonwebtoken';

const generateToken = (userId: string, role: string) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export { generateToken };
