export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';

import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.redirect(new URL('/verify-email?error=invalid-token', request.url));
    }

    await connectToDatabase();

    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/verify-email?error=invalid-or-expired', request.url));
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.redirect(new URL(`/verify-email?verified=true&email=${encodeURIComponent(email)}`, request.url));
  } catch (err) {
    console.error('Server verify error:', err);
    return NextResponse.redirect(new URL('/verify-email?error=server', request.url));
  }
}