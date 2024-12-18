import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL!);

        console.log('Connected to the database...');

        // Check if admin already exists
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const adminPassword = await bcrypt.hash('adminPassword123', 10);
            const adminUser = new User({
                name: 'Admin',
                firstName: 'Admin',
                email: 'admin@example.com',
                country: 'Country',
                password: adminPassword,
                role: 'admin',
                verified: true,
            });

            await adminUser.save();
            console.log('Default admin user created!');
        } else {
            console.log('Admin user already exists.');
        }

        // Close the connection after seeding
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding the database:', error);
        mongoose.connection.close();
    }
};

// Run the seed function
seed();

