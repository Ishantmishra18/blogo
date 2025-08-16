import { config } from 'dotenv';
config(); // Load .env first!

import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cors from 'cors';
import session from 'express-session';
import passport from './configs/passport.js'; 




const app = express();
connectDB();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://exanaly.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie'] 
}));

const jwtsec = process.env.JWT_SECRET;


app.use(express.json())
app.use(cookieParser())

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/admin', adminRoutes);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});