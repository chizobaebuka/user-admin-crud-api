import mongoose, { Schema } from 'mongoose';
import { IPost } from '../interface/post.interface';

const postSchema = new Schema<IPost>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
