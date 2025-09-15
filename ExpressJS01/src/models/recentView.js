import mongoose from 'mongoose';

const recentViewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', index: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
    index: true,
  },
  viewedAt: { type: Date, default: Date.now, index: true },
});

recentViewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const RecentView = mongoose.model('recent_view', recentViewSchema);
export default RecentView;
