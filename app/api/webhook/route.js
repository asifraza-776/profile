import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Payment from '@/models/Payment';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    
    // Default secret for easier setup, you can customize this later
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'getmeachai123';

    // Verify webhook signature to securely prove it came from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log('❌ Webhook signature mismatch. Hacking attempt detected?');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    const { event, payload } = JSON.parse(rawBody);

    console.log(`📡 WEBHOOK RECEIVED: ${event}`);

    // Only process successful payments
    if (event === "payment.captured" || event === "payment.authorized") {
      const paymentEntity = payload.payment.entity;
      
      const rzpPaymentId = paymentEntity.id;
      const rzpOrderId = paymentEntity.order_id;
       
      await connectDB();
      
      // Look for the database record we drafted when they clicked "Pay"
      const payment = await Payment.findOne({ oid: rzpOrderId });
      
      if (payment) {
        if (!payment.done) {
           // Because the phone browser failed, the webhook finishes the job!
           payment.done = true;
           payment.razorpay_payment_id = rzpPaymentId;
           payment.updatedAt = new Date();
           await payment.save();
           console.log(`✅✅✅ WEBHOOK SAVED THE DAY! Processed Mobile payment for: ${payment.name}`);
        } else {
           console.log('✅ Payment was already handled by the laptop browser (No action needed).');
        }
      } else {
         console.error('❌ Webhook failed: Could not find matching oid in MongoDB.');
      }
    }

    // Always respond 200 OK quickly! Or else Razorpay will retry the hook indefinitely.
    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook Crash:', error);
    return NextResponse.json({ success: false, error: 'Webhook processing failed: ' + error.message }, { status: 500 });
  }
}
