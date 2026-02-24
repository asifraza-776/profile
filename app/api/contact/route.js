// app/api/contact/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, projectType, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('profile'); // database name
    const collection = db.collection('contacts'); // collection name

    // Insert contact form data
    const result = await collection.insertOne({
      name,
      email,
      projectType: projectType || 'Other',
      message,
      createdAt: new Date(),
      status: 'unread'
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!',
        id: result.insertedId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}