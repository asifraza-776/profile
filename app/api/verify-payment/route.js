import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Payment from '@/models/Payment';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(req) {
  console.log('🚀🚀🚀 VERIFY API WAS CALLED! 🚀🚀🚀');
  
  try {
    await connectDB();
    console.log('📦 Database connected');
    
    const body = await req.json();
    console.log('📦 Request body:', JSON.stringify(body, null, 2));
    
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      oid
    } = body;

    console.log('🔍 Looking for payment with oid:', oid);
    const payment = await Payment.findOne({ oid });
    
    if (!payment) {
      console.log('❌ Payment NOT found for oid:', oid);
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    console.log('✅ Payment found:', {
      id: payment._id.toString(),
      to_user: payment.to_user,
      amount: payment.amount,
      currentStatus: payment.done
    });

    console.log('🔍 Looking for user:', payment.to_user);
    const user = await User.findOne({ username: payment.to_user });
    
    if (!user) {
      console.log('❌ User not found:', payment.to_user);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.razorpaysecret) {
      console.log('❌ User has no razorpaysecret');
      return NextResponse.json(
        { success: false, error: 'Payment secret not configured' },
        { status: 400 }
      );
    }

    console.log('✅ User found, secret length:', user.razorpaysecret.length);

    // Generate expected signature
    const bodyText = razorpay_order_id + '|' + razorpay_payment_id;
    console.log('📝 String to hash:', bodyText);
    
    const expectedSignature = crypto
      .createHmac('sha256', user.razorpaysecret)
      .update(bodyText)
      .digest('hex');

    console.log('🔍 Signature comparison:', {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature
    });

    if (expectedSignature === razorpay_signature) {
      // Mark payment as done
      payment.done = true;
      payment.razorpay_payment_id = razorpay_payment_id;
      payment.updatedAt = new Date();
      await payment.save();
      
      console.log('✅✅✅ PAYMENT VERIFIED AND UPDATED! ID:', payment._id.toString());
      
      return NextResponse.json({ 
        success: true,
        message: 'Payment verified successfully' 
      });
    } else {
      console.log('❌❌❌ SIGNATURE MISMATCH!');
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌❌❌ VERIFICATION ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed: ' + error.message },
      { status: 500 }
    );
  }
}