import mongoose from "mongoose";

export interface IPost extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
}