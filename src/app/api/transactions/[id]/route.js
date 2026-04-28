import { NextResponse } from 'next/server'

// Mock data - in production, fetch from database
export async function GET(request, { params }) {
  const { id } = params
  
  // Mock transaction data
  const transactions = {
    'TXN-8472-AURA': {
      transactionId: 'TXN-8472-AURA',
      date: 'Oct 24, 2024',
      time: '14:32 CET',
      amount: '500.00',
      newBalance: '12,500.00',
      paymentMethod: 'Visa **** 1234',
      status: 'Completed',
      email: 'user@example.com'
    }
  }
  
  const transaction = transactions[id]
  
  if (!transaction) {
    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(transaction)
}