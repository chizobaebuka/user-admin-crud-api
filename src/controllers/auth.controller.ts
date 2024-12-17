import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateVerificationCode } from '../utils';
import { loginSchema, signUpSchema, verifyCodeSchema } from '../validators/user.validator';
import User from '../models/user.model';
import { sendVerificationEmail } from '../services/email.service';
import { generateToken } from '../services/jwt.service';

const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedData = signUpSchema.parse(req.body);
        const { name, firstName, email, country, password } = parsedData;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).send('User already exists.');
            return;
        }

        const verificationCode = generateVerificationCode();
        const hashedPassword = await bcrypt.hashSync(password, 10)

        const newUser = new User({ 
            name,
            firstName,
            email,
            country,
            password: hashedPassword,
            verificationCode
        });

        await newUser.save();

        await sendVerificationEmail(newUser.email, verificationCode);

        res.status(201).json({
            message: 'User created successfully. Please verify your email.',
            user: {
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error: any) {
        res.status(400).send(`An error occurred: ${error.message}`);
    }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, verificationCode } = verifyCodeSchema.parse(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send('User not found.');
            return;
        }

        if (user.verificationCode !== verificationCode) {
            res.status(400).send('Invalid verification code.');
            return;
        }

        user.verified = true;
        user.verificationCode = ''; // Clear verification code

        await user.save();

        res.status(200).json({
            message: 'Email verified successfully.',
            user: {
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(400).send(`An error occurred: ${error.message}`);
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const parsedData = loginSchema.parse(req.body);
        const { email, password } = parsedData;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send('User not found.');
            return;
        }

        console.log({ userpassword: user.password });
        console.log({ password });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).send('Invalid password.');
            return;
        }

        const token = generateToken(user._id.toString(), user.role);

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export { signUp, verifyEmail, login };
