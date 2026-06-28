import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        console.log("MONGODB_URI from env:", mongoUri ? "✅ Found" : "❌ UNDEFINED");
        
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};
