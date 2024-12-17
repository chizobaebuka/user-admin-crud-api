import { Types } from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId; 
    name: string;
    firstName: string;
    email: string;
    country: string;
    password: string;
    verified: boolean;
    verificationCode: string;
    role: 'user' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}


