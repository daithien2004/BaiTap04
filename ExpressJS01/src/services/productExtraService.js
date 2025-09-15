import Favorite from '../models/favorite.js';
import RecentView from '../models/recentView.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import Comment from '../models/comment.js';
import mongoose from 'mongoose';

// Favorite
export const addFavoriteService = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId))
    return { EC: 1, EM: 'Invalid product id' };
  try {
    const doc = await Favorite.findOneAndUpdate(
      { userId, productId },
      { $setOnInsert: { userId, productId } },
      { upsert: true, new: true }
    );
    return { EC: 0, EM: 'Added', data: doc };
  } catch (err) {
    if (err.code === 11000) return { EC: 0, EM: 'Added (duplicate)' };
    throw err;
  }
};

export const removeFavoriteService = async (userId, productId) => {
  await Favorite.deleteOne({ userId, productId });
  return { EC: 0, EM: 'Removed' };
};

export const listFavoritesService = async (
  userId,
  { page = 1, limit = 20 } = {}
) => {
  const numericLimit = Math.min(Number(limit) || 20, 100);
  const numericPage = Math.max(Number(page) || 1, 1);
  const skip = (numericPage - 1) * numericLimit;
  const docs = await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(numericLimit)
    .populate('productId');
  const total = await Favorite.countDocuments({ userId });
  const items = docs.map((d) => d.productId);
  return {
    EC: 0,
    EM: 'OK',
    data: {
      items,
      total,
      page: numericPage,
      limit: numericLimit,
      hasMore: skip + items.length < total,
    },
  };
};

export const addRecentViewService = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { EC: 1, EM: 'Invalid product id' };
  }

  // Guest -> không lưu DB
  if (!userId) {
    return { EC: 2, EM: 'No user logged in' };
  }

  // Upsert: nếu đã có thì update thời gian, nếu chưa có thì tạo mới
  await RecentView.findOneAndUpdate(
    { userId, productId },
    { $set: { viewedAt: new Date() } },
    { upsert: true }
  );

  // Giới hạn chỉ lưu tối đa 50 sản phẩm đã xem
  const count = await RecentView.countDocuments({ userId });
  if (count > 50) {
    const toRemove = await RecentView.find({ userId })
      .sort({ viewedAt: -1 }) // mới nhất trước
      .skip(50) // bỏ qua 50 cái mới nhất
      .select('_id');

    if (toRemove.length) {
      await RecentView.deleteMany({ _id: { $in: toRemove.map((t) => t._id) } });
    }
  }

  return { EC: 0, EM: 'OK' };
};

export const listRecentViewsService = async (userId, { limit = 20 } = {}) => {
  const numericLimit = Math.min(Number(limit) || 20, 50);
  const docs = await RecentView.find({ userId })
    .sort({ viewedAt: -1 })
    .limit(numericLimit)
    .populate('productId');
  const items = docs.map((d) => d.productId);
  return { EC: 0, EM: 'OK', data: items };
};

// Similar products (by category, fallback: price range)
export const getSimilarProductsService = async (
  productId,
  { limit = 6 } = {}
) => {
  const product = await Product.findById(productId);
  if (!product) return { EC: 1, EM: 'Product not found' };

  // primary: same category (exclude itself)
  const byCategory = await Product.find({
    categoryId: product.categoryId,
    _id: { $ne: product._id },
  }).limit(limit);

  if (byCategory.length >= limit) return { EC: 0, EM: 'OK', data: byCategory };

  // fallback: similar price +/- 30%
  const remain = limit - byCategory.length;
  const low = product.price * 0.7;
  const high = product.price * 1.3;
  const byPrice = await Product.find({
    _id: { $ne: product._id },
    price: { $gte: low, $lte: high },
  }).limit(remain);

  const res = [...byCategory, ...byPrice];
  return { EC: 0, EM: 'OK', data: res };
};

// Stats: buyers count, comments count
export const getProductStatsService = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId))
    return { EC: 1, EM: 'Invalid product id' };

  // buyers: count distinct users who have ordered this product
  const buyersAgg = await Order.aggregate([
    { $unwind: '$items' },
    { $match: { 'items.productId': new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$userId' } },
    { $count: 'buyers' },
  ]);
  const buyers = buyersAgg[0]?.buyers || 0;

  // total orders count containing product
  const ordersCountAgg = await Order.aggregate([
    { $unwind: '$items' },
    { $match: { 'items.productId': new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$_id' } },
    { $count: 'orders' },
  ]);
  const orders = ordersCountAgg[0]?.orders || 0;

  // comments count
  const comments = await Comment.countDocuments({
    productId: new mongoose.Types.ObjectId(productId),
  });

  return { EC: 0, EM: 'OK', data: { buyers, orders, comments } };
};
