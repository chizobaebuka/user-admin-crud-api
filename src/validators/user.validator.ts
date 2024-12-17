import { z } from 'zod';

const signUpSchema = z.object({
    name: z.string().min(1),
    firstName: z.string().min(1),
    email: z.string().email(),
    country: z.string().min(1),
    password: z.string().min(6)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const verifyCodeSchema = z.object({
    email: z.string().email(),
    verificationCode: z.string().length(6)
});

export { signUpSchema, verifyCodeSchema, loginSchema };
