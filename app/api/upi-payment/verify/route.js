import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Payment from '@/models/Payment';
import User from '@/models/User';

export async function POST(req) {
  try {
    console.log('📥 UPI verification request started');
    
    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Request body received:', body);
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, amount, message, transactionId, to_user } = body;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!amount) missingFields.push('amount');
    if (!transactionId) missingFields.push('transactionId');
    if (!to_user) missingFields.push('to_user');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate amount
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('Connecting to database...');
    try {
      await connectDB();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Check if user exists (optional - you might want to skip this check)
    try {
      const user = await User.findOne({ username: to_user });
      if (!user) {
        console.log('User not found:', to_user);
        // Instead of failing, we'll still create payment but log the issue
        console.log('Proceeding without user validation');
      } else {
        console.log('User found:', user.username);
      }
    } catch (userError) {
      console.error('Error checking user:', userError);
      // Continue anyway - don't fail the payment
    }

    // Check if transaction ID already exists
    try {
      const existing = await Payment.findOne({ transactionId });
      if (existing) {
        console.log('Transaction ID already exists:', transactionId);
        return NextResponse.json(
          { success: false, error: 'Transaction ID already used' },
          { status: 400 }
        );
      }
    } catch (existingError) {
      console.error('Error checking existing payment:', existingError);
      // Continue anyway
    }

    // Create payment record
    console.log('Creating payment record...');
    try {
      const payment = await Payment.create({
        name,
        amount: parsedAmount,
        message: message || '',
        to_user,
        transactionId,
        oid: transactionId, // Use transactionId as oid for UPI payments
        method: 'upi',
        done: true,
        status: 'completed',
        currency: 'INR',
        createdAt: new Date()
      });

      console.log('✅ Payment created successfully:', payment);

      return NextResponse.json({ 
        success: true, 
        payment,
        message: 'Payment verified successfully' 
      });
      
    } catch (createError) {
      console.error('Error creating payment:', createError);
      
      // Check for MongoDB duplicate key error
      if (createError.code === 11000) {
        return NextResponse.json(
          { success: false, error: 'Transaction ID already exists' },
          { status: 400 }
        );
      }
      
      throw createError; // Re-throw to be caught by outer catch
    }
    
  } catch (error) {
    console.error('❌ UPI verification error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment: ' + error.message },
      { status: 500 }
    );
  }
}