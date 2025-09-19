import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const createOrderService = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate(
    'items.productId',
    'price'
  );
  if (!cart || cart.items.length === 0) {
    throw new Error('Giỏ hàng trống');
  }

  // Tạo mảng items cho order
  const orderItems = cart.items.map((item) => ({
    productId: item.productId._id,
    qty: item.quantity,
    price: item.productId.price,
  }));

  const order = await Order.create({
    userId,
    items: orderItems,
    status: 'created',
  });

  // Xóa giỏ hàng sau khi thanh toán
  cart.items = [];
  await cart.save();

  return order;
};

export const getUserOrdersService = async (userId) => {
  return await Order.find({ userId }).populate(
    'items.productId',
    'name price thumbnail'
  );
};
