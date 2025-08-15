import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import User from './models/user.js'; 
import jwt from 'jsonwebtoken';

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
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
const BACKEND_URL = process.env.BACKEND_URL
const FRONTEND_URL = process.env.FRONTEND_URL

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND_URL}/auth/google/callback`,
    passReqToCallback: true
},
async function(req, accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = await bcrypt.hash(randomPassword, 10)

            const email = profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : `${profile.id}@google.com`

            user = await User.create({
                googleId: profile.id,
                username: profile.displayName || `user_${profile.id.substring(0, 8)}`,
                cover: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                password: hashedPassword,
            })
        }

        return done(null, user)
    } catch (error) {
        console.error("Google strategy error:", error)
        return done(error, null)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})

app.use(express.json())
app.use(cookieParser())

app.use(session({
    secret: jwtsec,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 3600000,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        httpOnly: false // Allow frontend to access for debugging if needed
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      jwtsec,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: isProduction ? '.onrender.com' : undefined
    });

    res.redirect(`${FRONTEND_URL}/profile`);
  }
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/admin', adminRoutes);


// Google Auth Routes
app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Longer expiration
    );
    
    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
    });
    
    // Also include token in redirect URL for frontend access
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});