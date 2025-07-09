import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    cover: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2NIXc73ZgxZfbifJP3Bsv35sekQyklo-9JA&s'},
    name: String,
    email: String,
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
  }
);

const User = mongoose.model('User', UserSchema);
export default User;