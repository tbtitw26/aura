import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'card_payment', 'transfer', 'fee'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['EUR', 'USD', 'GBP', 'JPY', 'CHF'],
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  metadata: {
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    merchant: String,
    paymentMethod: String,
    reference: String,
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate transaction ID
transactionSchema.virtual('transactionId').get(function() {
  return `TXN-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);