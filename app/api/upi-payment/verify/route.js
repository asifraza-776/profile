import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Payment from '@/models/Payment';

export async function POST(req) {
  try {
    await connectDB();
    const { name, amount, message, transactionId, to_user } = await req.json();

    // Check if transaction ID already exists
    const existing = await Payment.findOne({ transactionId });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID already used' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await Payment.create({
      name,
      amount,
      message,
      to_user,
      transactionId,
      done: true,
      method: 'upi',
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      payment,
      message: 'Payment verified successfully' 
    });
  } catch (error) {
    console.error('UPI verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}