import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    cover: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2NIXc73ZgxZfbifJP3Bsv35sekQyklo-9JA&s' },

    name: String,
    email: String,
    phone: String,
    dob: Date,
    gender: String,
    bio: String,
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;