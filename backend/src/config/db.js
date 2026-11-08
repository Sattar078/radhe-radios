import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://sattaarkureshi87_db_user:dEzu6wvTKbILmDfB@cluster0.f7e6aar.mongodb.net/radhe_studio?retryWrites=true&w=majority';
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 100, // Handle up to 100 concurrent DB socket streams
      minPoolSize: 10,  // Keep 10 persistent hot sockets alive to prevent handshake latency
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4 for fast DNS resolution
    });
    console.log(`✅ MongoDB Connected (High-Concurrency Pool Ready): ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

export default mongoose;
