import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI || 'mongodb+srv://sattaarkureshi87_db_user:dEzu6wvTKbILmDfB@cluster0.f7e6aar.mongodb.net/radhe_studio?retryWrites=true&w=majority';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

export default mongoose;
