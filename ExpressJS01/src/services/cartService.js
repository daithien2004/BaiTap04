import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const getCartService = async (userId) => {
  return await Cart.findOne({ userId }).populate(
    'items.productId',
    'name price thumbnail'
  );
};

export const addToCartService = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [{ productId, quantity }],
    });
  } else {
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
  }
  return await cart.populate('items.productId', 'name price thumbnail');
};

export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item) return null;

  item.quantity = quantity;
  await cart.save();
  return await cart.populate('items.productId', 'name price thumbnail');
};

export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  await cart.save();
  return await cart.populate('items.productId', 'name price thumbnail');
};

export const clearCartService = async (userId) => {
  return await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );
};
