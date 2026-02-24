import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  profilepic: { type: String, default: '' },
  bio: { type: String, default: '' },
    upiid: { type: String, default: 'asifazhar92@oksbi' },
  razorpayid: { type: String, default: '' },
  razorpaysecret: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);