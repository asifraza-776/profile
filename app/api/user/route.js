// app/api/user/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import User from '@/models/User';
import Payment from '@/models/Payment';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    console.log('Fetching user with email:', email);

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get ONLY completed payments (done: true) for this user
    const payments = await Payment.find({ 
      to_user: user.username,
      done: true 
    }).sort({ createdAt: -1 });

    console.log(`Found ${payments.length} completed payments for ${user.username}`);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilepic: user.profilepic,
        razorpayid: user.razorpayid
      },
      payments: payments // This will now show only completed payments
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}