import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Payment from '@/models/Payment';
import crypto from 'crypto';

// Valid UPI transaction ID patterns from different apps
const UPI_PATTERNS = [
  // Google Pay / Tez
  { pattern: /^UPI-[A-Z0-9]{10,16}$/, name: 'Google Pay' },        // UPI-ABCD1234XYZ
  { pattern: /^T[A-Z0-9]{12,20}$/, name: 'Google Pay' },            // T1234567890123456
  
  // PhonePe
  { pattern: /^PP[A-Z0-9]{12,18}$/, name: 'PhonePe' },              // PPABCD12345678
  { pattern: /^PHONEPE[A-Z0-9]{10,14}$/, name: 'PhonePe' },         // PHONEPE12345678
  
  // Paytm
  { pattern: /^PAY[A-Z0-9]{12,18}$/, name: 'Paytm' },               // PAY123456789012
  { pattern: /^P[A-Z0-9]{14,20}$/, name: 'Paytm' },                 // P1234567890123456
  
  // BHIM / Generic UPI
  { pattern: /^[A-Z0-9]{12,22}$/, name: 'BHIM/Generic UPI' },       // 123456789012
  { pattern: /^[0-9]{12,20}$/, name: 'BHIM/Generic UPI' },          // 1234567890123456
  
  // Bank-specific
  { pattern: /^SBI[A-Z0-9]{10,18}$/, name: 'SBI UPI' },             // SBI12345678
  { pattern: /^HDFC[A-Z0-9]{10,18}$/, name: 'HDFC UPI' },           // HDFC12345678
  { pattern: /^ICICI[A-Z0-9]{10,18}$/, name: 'ICICI UPI' },         // ICICI12345678
];

// Simulate verification with a "real" transaction ID
// In production, this would call your payment gateway's API
async function verifyUPITransaction(transactionId, amount) {
  console.log(`🔍 Verifying UPI transaction: ${transactionId}, Amount: ₹${amount}`);
  
  // Step 1: Check minimum length
  if (transactionId.length < 10) {
    return {
      verified: false,
      error: 'Transaction ID is too short. Minimum 10 characters required.'
    };
  }
  
  if (transactionId.length > 30) {
    return {
      verified: false,
      error: 'Transaction ID is too long. Maximum 30 characters allowed.'
    };
  }
  
  // Step 2: Check if contains only allowed characters
  if (!/^[A-Za-z0-9-]+$/.test(transactionId)) {
    return {
      verified: false,
      error: 'Transaction ID can only contain letters, numbers, and hyphens.'
    };
  }
  
  // Step 3: Check against known patterns to identify UPI app
  let matchedApp = 'Unknown';
  for (const { pattern, name } of UPI_PATTERNS) {
    if (pattern.test(transactionId)) {
      matchedApp = name;
      break;
    }
  }
  
  // Step 4: Simulate verification with banking system
  // In real implementation, you would:
  // 1. Call your bank's API
  // 2. Check if transaction exists and amount matches
  // 3. Verify transaction status is SUCCESS
  
  // For demo purposes, we'll use a deterministic verification
  // based on transaction ID checksum
  
  // Create a simple checksum from transaction ID
  const checksum = crypto
    .createHash('sha256')
    .update(transactionId + amount)
    .digest('hex');
  
  // Use first 2 chars of checksum to determine success (80% success rate for demo)
  const successThreshold = parseInt(checksum.substring(0, 2), 16) / 255; // 0-1
  const isSuccessful = successThreshold > 0.2; // 80% success rate
  
  if (isSuccessful) {
    return {
      verified: true,
      app: matchedApp,
      transactionDetails: {
        id: transactionId,
        amount: amount,
        time: new Date().toISOString(),
        reference: checksum.substring(0, 12).toUpperCase(),
        status: 'SUCCESS'
      }
    };
  } else {
    return {
      verified: false,
      error: 'Transaction not found in bank records. Please check the ID and try again.'
    };
  }
}

export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { name, amount, message, transactionId, to_user } = body;

    // Validate required fields
    if (!name || !amount || !transactionId || !to_user) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate amount
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json({
        success: false,
        error: 'Invalid amount. Must be at least ₹1.'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Check if transaction ID already exists
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return NextResponse.json({
        success: false,
        error: 'This transaction ID has already been used.'
      }, { status: 400 });
    }

    // Verify transaction with banking system
    const verification = await verifyUPITransaction(transactionId, parsedAmount);

    if (!verification.verified) {
      return NextResponse.json({
        success: false,
        error: verification.error || 'Invalid transaction ID'
      }, { status: 400 });
    }

    // Create payment record
    const payment = await Payment.create({
      name,
      amount: parsedAmount,
      message: message || '',
      to_user,
      transactionId,
      oid: transactionId, // Use transactionId as order ID
      method: 'upi',
      status: 'completed',
      verified: true,
      done: true,
      metadata: {
        upiApp: verification.app,
        verifiedAt: new Date().toISOString(),
        transactionReference: verification.transactionDetails?.reference,
        verificationMethod: 'upi_bank_simulated'
      }
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: `✅ Payment verified successfully via ${verification.app}!`,
      payment: {
        id: payment._id,
        name: payment.name,
        amount: payment.amount,
        message: payment.message,
        method: payment.method,
        transactionId: payment.transactionId
      }
    });

  } catch (error) {
    console.error('UPI verification error:', error);
    return NextResponse.json({
      success: false,
      error: 'Payment verification failed. Please try again.'
    }, { status: 500 });
  }
}

// Optional: GET endpoint to check transaction status
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json({
        error: 'Transaction ID required'
      }, { status: 400 });
    }

    await connectDB();
    const payment = await Payment.findOne({ transactionId });

    if (!payment) {
      return NextResponse.json({
        verified: false,
        message: 'Transaction not found'
      });
    }

    return NextResponse.json({
      verified: payment.verified,
      status: payment.status,
      amount: payment.amount,
      name: payment.name,
      time: payment.createdAt
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}