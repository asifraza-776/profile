import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  to_user: { type: String, required: true },
  oid: { type: String, unique: true, sparse: true }, // For Razorpay
  transactionId: { type: String, unique: true, sparse: true }, // For UPI
  message: { type: String, default: '' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['razorpay', 'upi'], default: 'razorpay' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  done: { type: Boolean, default: false }
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);