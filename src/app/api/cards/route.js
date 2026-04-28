export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Card from '@/models/Card';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectToDatabase();

    // Try cookie first, then Authorization header as fallback
    let token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
      if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
      else token = request.headers.get('x-auth-token') || null;
    }

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized - invalid or missing token' }, { status: 401 });

    const body = await request.json();
    const { brand, last4, expMonth, expYear, cardholderName, isVirtual, metadata } = body;

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const card = await Card.create({
      userId: user._id,
      brand,
      last4,
      expMonth,
      expYear,
      cardholderName,
      isVirtual: !!isVirtual,
      metadata: metadata || {},
    });

    return NextResponse.json({ success: true, card }, { status: 201 });
  } catch (err) {
    console.error('Create card error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    let token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
      if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
      else token = request.headers.get('x-auth-token') || null;
    }

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized - invalid or missing token' }, { status: 401 });

    const cards = await Card.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, cards }, { status: 200 });
  } catch (err) {
    console.error('Fetch cards error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
