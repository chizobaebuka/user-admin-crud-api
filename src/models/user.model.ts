import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../interface/auth.interface";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, default: "" }, // Default to empty string
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

// Create User model from schema
const User = mongoose.model<IUser>('User', userSchema);

export default User;
