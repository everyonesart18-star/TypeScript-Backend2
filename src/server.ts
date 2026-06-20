import dotenv from 'dotenv';
import { connectDB } from './config/db';
import app from './app';

dotenv.config();

console.log("=== ENV DEBUG ===");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ UNDEFINED");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Exists" : "❌ Missing");
console.log("================");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
});