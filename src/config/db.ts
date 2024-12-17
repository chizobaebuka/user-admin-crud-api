import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URL!)
mongoose.connection.on('error', (error) => {
    console.log(error);
    process.exit(1);
});

export default mongoose;