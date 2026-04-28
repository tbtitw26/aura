export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Card from '@/models/Card';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request, { params }) {
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

    const cardId = params.id;
    const card = await Card.findById(cardId);
    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    if (card.userId.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Card.deleteOne({ _id: cardId });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete card error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
