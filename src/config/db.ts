import mongoose from 'mongoose';
import process from 'process';
import 'dotenv/config';

export const connectDB = async () => {
    try {
        console.log("MONGODB_URI from env:", process.env.MONGODB_URI ? "✅ Found" : "❌ UNDEFINED");
        
        const conn = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};


