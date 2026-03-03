// models/Payment.js
import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  to_user: { type: String, required: true },
  oid: { type: String }, // Order ID (for Razorpay)
  message: { type: String, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, enum: ['razorpay', 'upi'], default: 'razorpay' },
  transactionId: { type: String, unique: true, sparse: true }, // Make transactionId unique but allow null
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  done: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Check if model exists before creating new one
export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);