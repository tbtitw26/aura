import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import Transaction from '@/models/Transaction'
import Wallet from '@/models/Wallet'
import { verifyToken } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    await connectToDatabase()

    const token = request.cookies.get('auth-token')?.value
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params

    const transaction = await Transaction.findById(id).populate('userId', 'firstName lastName email')
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Check if transaction belongs to user
    if (transaction.userId._id.toString() !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current wallet balance
    const wallet = await Wallet.findOne({ userId: decoded.userId })

    const transactionData = {
      transactionId: transaction._id.toString(),
      date: transaction.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      time: transaction.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
      amount: transaction.amount.toFixed(2),
      newBalance: wallet ? wallet.totalBalance.toFixed(2) : '0.00',
      paymentMethod: transaction.metadata?.paymentMethod || 'Card',
      status: transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1),
      email: transaction.userId.email,
      currency: transaction.currency,
      type: transaction.type,
      description: transaction.description
    }

    return NextResponse.json(transactionData)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}