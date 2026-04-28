import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  brand: { type: String },
  last4: { type: String },
  expMonth: { type: Number },
  expYear: { type: Number },
  cardholderName: { type: String },
  isVirtual: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

cardSchema.index({ userId: 1 });

export default mongoose.models.Card || mongoose.model('Card', cardSchema);
