import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import { seedProducts } from './models/Product.js';
import { seedDownloads } from './models/DownloadItem.js';
import { seedReviews } from './models/Review.js';
import { seedAdminUser } from './models/User.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inquiryRoutes from './routes/inquiries.js';
import profileRoutes from './routes/profile.js';
import contactRoutes from './routes/contact.js';
import downloadRoutes from './routes/downloads.js';
import reviewRoutes from './routes/reviews.js';
import statsRoutes from './routes/stats.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and seed baseline data & default Admin account
connectDb().then(async () => {
  await seedAdminUser();
  await seedProducts();
  await seedDownloads();
  await seedReviews();
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Base check
app.get('/', (req, res) => {
  res.json({
    message: 'Radhe Radios Audio Engineering API is running 🚀',
    location: 'Transport Nagar, Kota, Rajasthan',
    status: 'Healthy',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running → http://localhost:${PORT}`);
  console.log(`   Database → MongoDB Atlas`);
  console.log(`   Auth     → /api/auth (register, login, me)`);
  console.log(`   Admin    → /api/admin (overview, inquiries, contacts, users)`);
  console.log(`   Products → /api/products (search, specs, admin CRUD)`);
  console.log(`   Contact  → /api/contact (leads & dealership inquiries)`);
  console.log(`   Blueprints→ /api/downloads (schematics & tracking)`);
  console.log(`   Reviews  → /api/reviews (DJ operator feedback)`);
  console.log(`   Stats    → /api/stats (live metrics)\n`);
});
