const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const { hashPassword } = require('./utils/auth');

dotenv.config();

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@zevenstone.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const hashedPassword = await hashPassword('123456');

        await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@zevenstone.com',
            password: hashedPassword,
            employeeId: 'ZS00',
            department: 'Management',
            role: 'Admin',
        });

        console.log('Admin user created');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee-portal');
        console.log('MongoDB Connected');
        await seedAdmin();
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

connectDB();
