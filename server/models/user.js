import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() { return this.authMethod === 'local'; },
    select: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    required: true,
    default: 'local'
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true
  },
  cover: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2NIXc73ZgxZfbifJP3Bsv35sekQyklo-9JA&s'
  },
  name: String,
  history: [String]
}, { timestamps: true });

// Password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.authMethod !== 'local') return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export default mongoose.model('User', UserSchema);