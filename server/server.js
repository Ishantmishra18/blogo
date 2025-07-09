
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

const app = express();
connectDB();

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());



// routes
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});