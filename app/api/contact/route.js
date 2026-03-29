// app/api/contact/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Contact from '@/models/Contact';

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

    // Connect securely using uniform Mongoose connection
    await connectDB();

    // Insert contact form data
    const newContact = await Contact.create({
      name,
      email,
      projectType: projectType || 'Other',
      message
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully!',
        id: newContact._id.toString() 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message: ' + error.message },
      { status: 500 }
    );
  }
}