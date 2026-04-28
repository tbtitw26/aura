export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { generateRandomToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // generate new verification token
    const token = generateRandomToken();
    user.emailVerificationToken = token;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    try {
      const result = await sendVerificationEmail(user.email, token, `${user.firstName} ${user.lastName}`);
      if (result && result.previewUrl) {
        return NextResponse.json({ success: true, previewUrl: result.previewUrl, warning: 'Email sent to test inbox (Ethereal). Check server logs for preview link.' });
      }
      return NextResponse.json({ success: true });
    } catch (emailErr) {
      console.error('Failed to resend verification email:', emailErr);
      return NextResponse.json({ success: false, error: 'Failed to send verification email (check server SMTP settings)' }, { status: 502 });
    }
  } catch (err) {
    console.error('Resend verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
