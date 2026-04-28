export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { token, email } = body;
    
    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      );
    }
    
    // Find user with matching token
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
    
    // Verify user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}