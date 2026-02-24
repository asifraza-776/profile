import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Payment from '@/models/Payment';
import User from '@/models/User';
import Razorpay from 'razorpay';
import shortid from 'shortid';

export async function POST(req) {
  try {
    await connectDB();
    const { amount, to_user, name, message } = await req.json();

    // Get user's Razorpay credentials
    const user = await User.findOne({ username: to_user });
    
    const keyId = user?.razorpayid || process.env.RAZORPAY_KEY_ID;
    const keySecret = user?.razorpaysecret || process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { success: false, error: 'Payment not configured' },
        { status: 400 }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    // Create order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: shortid.generate(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save payment with order.id (not receipt)
    await Payment.create({
      oid: order.id,  // This matches what frontend sends
      amount: amount / 100,
      to_user,
      name,
      message
    });

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}