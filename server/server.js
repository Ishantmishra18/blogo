import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import listingRoutes from './routes/listingRoute.js';
import userRoute from './routes/userRoute.js';
import cors from 'cors';

const app = express();
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'https://travo-1.onrender.com'],
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());



// Other routes (without io)
app.use('/api/auth', authRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/user', userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});