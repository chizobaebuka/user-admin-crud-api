import mongoose from './config/db';  // Import the MongoDB connection setup
import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app';

dotenv.config();

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await mongoose.connection.asPromise();
        console.log('Connected to the database successfully.');

        const server = createServer(app);
        server.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
};

startServer();


