export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Transaction from '@/models/Transaction';
import Card from '@/models/Card';
import { verifyToken } from '@/lib/auth';

const CURRENCY_SYMBOL = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CHF: 'CHF ',
};

function initialFromLabel(label) {
  const t = (label || '?').trim();
  return t ? t.charAt(0).toUpperCase() : '?';
}

export async function GET(request) {
  try {
    await connectToDatabase();

    let token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
      if (authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.userId?.toString?.() ?? String(decoded.userId);

    const rows = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const cardIds = [
      ...new Set(
        rows
          .map((t) => t.metadata?.cardId)
          .filter(Boolean)
          .map((id) => id.toString())
      ),
    ];

    const cards = cardIds.length
      ? await Card.find({ _id: { $in: cardIds } }).select('last4').lean()
      : [];

    const last4ById = new Map(cards.map((c) => [c._id.toString(), c.last4]));

    const transactions = rows.map((txn) => {
      const cid = txn.metadata?.cardId?.toString?.() ?? null;
      let cardLastFour = '—';
      if (cid) {
        const last4 = last4ById.get(cid);
        cardLastFour = last4 != null ? String(last4) : 'removed';
      } else if (txn.type === 'deposit') {
        cardLastFour = '—';
      }

      const created = txn.createdAt ? new Date(txn.createdAt) : new Date();
      const merchant =
        txn.type === 'deposit'
          ? txn.description || 'Wallet top-up'
          : txn.description || txn.metadata?.merchant || txn.type.replace('_', ' ');

      return {
        id: txn._id.toString(),
        merchant,
        merchantInitial: initialFromLabel(merchant),
        date: created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: created.toISOString(),
        cardLastFour,
        amount: txn.amount,
        type: txn.type,
        currency: CURRENCY_SYMBOL[txn.currency] || `${txn.currency} `,
        status: txn.status,
      };
    });

    return NextResponse.json({ success: true, transactions });
  } catch (err) {
    console.error('List transactions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
