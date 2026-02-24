import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { email, username, bio, razorpayid, razorpaysecret } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required' },
        { status: 400 }
      );
    }

    // Find and update user
    const updateData = {
      username,
      bio,
      razorpayid
    };

    // Only update secret if provided
    if (razorpaysecret) {
      updateData.razorpaysecret = razorpaysecret;
    }

    const user = await User.findOneAndUpdate(
      { email },
      updateData,
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        bio: user.bio,
        razorpayid: user.razorpayid
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}