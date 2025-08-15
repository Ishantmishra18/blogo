import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
      username: { 
    type: String, 
    required: function() { return this.authMethod === 'local'; } // Only required for local auth
  },
  password: { 
    type: String, 
    required: function() { return this.authMethod === 'local'; }, // Only required for local auth
    select: false // Never return password in queries
  },
  email: { 
    type: String, 
    unique: true 
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: { 
    type: String,
    unique: true,
    sparse: true // Allows multiple nulls (for non-Google users)
  },
    cover: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2NIXc73ZgxZfbifJP3Bsv35sekQyklo-9JA&s'},
    name: String,
    email: String,
    history: [String],
  }
);

const User = mongoose.model('User', UserSchema);
export default User;