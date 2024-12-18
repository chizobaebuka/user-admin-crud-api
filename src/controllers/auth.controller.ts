import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateVerificationCode } from '../utils';
import { loginSchema, signUpSchema, verifyCodeSchema } from '../validators/user.validator';
import User from '../models/user.model';
import { sendVerificationEmail } from '../services/email.service';
import { generateToken } from '../services/jwt.service';
import logger from '../utils/logger'; // Winston logger
import { rateLimiter } from '../middleware/ratelimitter.middleware';

const signUp = [
    rateLimiter,
    async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('Sign-up attempt', { endpoint: req.originalUrl, email: req.body.email });

            const parsedData = signUpSchema.parse(req.body);
            const { name, firstName, email, country, password } = parsedData;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                logger.warn('User already exists', { email });
                res.status(400).send('User already exists.');
                return;
            }

            const verificationCode = generateVerificationCode();
            const hashedPassword = await bcrypt.hashSync(password, 10);

            const newUser = new User({
                name,
                firstName,
                email,
                country,
                password: hashedPassword,
                verificationCode,
            });

            await newUser.save();
            await sendVerificationEmail(newUser.email, verificationCode);

            logger.info('User created successfully, verification email sent', { email });

            res.status(201).json({
                message: 'User created successfully. Please verify your email.',
                user: {
                    email: newUser.email,
                    role: newUser.role,
                },
            });
        } catch (error: any) {
            logger.error('Error in sign-up', { error: error.message, email: req.body.email });
            res.status(400).send(`An error occurred: ${error.message}`);
        }
    },
];

// Email verification function with logging and rate limiting
const verifyEmail = [
    rateLimiter,
    async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('Email verification attempt', { endpoint: req.originalUrl, email: req.body.email });

            const { email, verificationCode } = verifyCodeSchema.parse(req.body);

            const user = await User.findOne({ email });
            if (!user) {
                logger.warn('User not found during email verification', { email });
                res.status(404).send('User not found.');
                return;
            }

            if (user.verificationCode !== verificationCode) {
                logger.warn('Invalid verification code', { email });
                res.status(400).send('Invalid verification code.');
                return;
            }

            user.verified = true;
            user.verificationCode = ''; // Clear verification code
            await user.save();

            logger.info('Email verified successfully', { email });

            res.status(200).json({
                message: 'Email verified successfully.',
                user: {
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error: any) {
            logger.error('Error in email verification', { error: error.message, email: req.body.email });
            res.status(400).send(`An error occurred: ${error.message}`);
        }
    },
];

const login = [
    rateLimiter,
    async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info('Login attempt', { endpoint: req.originalUrl, email: req.body.email });

            const parsedData = loginSchema.parse(req.body);
            const { email, password } = parsedData;

            const user = await User.findOne({ email });
            if (!user) {
                logger.warn('Login failed: User not found', { email });
                res.status(404).send('User not found.');
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                logger.warn('Login failed: Invalid password', { email });
                res.status(400).send('Invalid password.');
                return;
            }

            const token = generateToken(user._id.toString(), user.role);

            logger.info('Login successful', { email });

            res.status(200).json({
                message: 'Login successful.',
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error: any) {
            logger.error('Error in login', { error: error.message, email: req.body.email });
            res.status(400).send(error.message);
        }
    },
];

export { signUp, verifyEmail, login };
