import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  balances: {
    EUR: { type: Number, default: 0, min: 0 },
    USD: { type: Number, default: 0, min: 0 },
    GBP: { type: Number, default: 0, min: 0 },
    JPY: { type: Number, default: 0, min: 0 },
    CHF: { type: Number, default: 0, min: 0 },
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update totalBalance before saving
walletSchema.pre('save', function() {
  this.totalBalance = Object.values(this.balances).reduce((sum, val) => sum + val, 0);
  this.updatedAt = Date.now();
});

// Method to add balance
walletSchema.methods.addBalance = async function(currency, amount) {
  if (!this.balances[currency]) {
    throw new Error(`Currency ${currency} not supported`);
  }
  
  this.balances[currency] += amount;
  this.totalBalance += amount;
  await this.save();
  
  return this;
};

// Method to deduct balance
walletSchema.methods.deductBalance = async function(currency, amount) {
  if (!this.balances[currency]) {
    throw new Error(`Currency ${currency} not supported`);
  }
  
  if (this.balances[currency] < amount) {
    throw new Error('Insufficient balance');
  }
  
  this.balances[currency] -= amount;
  this.totalBalance -= amount;
  await this.save();
  
  return this;
};

export default mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);