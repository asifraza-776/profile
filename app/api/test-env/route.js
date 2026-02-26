// app/api/test-env/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';

export async function GET() {
  const envStatus = {
    // Check if the variable exists in the environment
    mongoUriExists: !!process.env.MONGODB_URI,
    // Show a preview (first 20 chars) to confirm it's the correct string
    mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'Not set',
    // Check other critical variables
    nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
    githubIdExists: !!process.env.GITHUB_ID,
  };

  // Try a direct connection to get a more specific error
  let dbStatus = 'Not attempted';
  try {
    await connectDB();
    dbStatus = 'Connected successfully';
  } catch (error) {
    dbStatus = `Connection failed: ${error.message}`;
  }

  return NextResponse.json({
    environment: envStatus,
    database: dbStatus,
  });
}