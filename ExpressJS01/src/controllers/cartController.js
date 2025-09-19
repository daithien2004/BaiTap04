import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeCartItemService,
  clearCartService,
} from '../services/cartService.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const cart = await getCartService(userId);
    return res.json({ EC: 0, EM: 'OK', data: cart });
  } catch (err) {
    return res.status(500).json({ EC: -1, EM: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;
    const cart = await addToCartService(userId, productId, quantity || 1);
    return res.json({ EC: 0, EM: 'Đã thêm vào giỏ hàng', data: cart });
  } catch (err) {
    return res.status(500).json({ EC: -1, EM: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId, quantity } = req.body;
    const cart = await updateCartItemService(userId, productId, quantity);
    if (!cart)
      return res.json({ EC: 1, EM: 'Không tìm thấy sản phẩm trong giỏ' });
    return res.json({ EC: 0, EM: 'Đã cập nhật giỏ hàng', data: cart });
  } catch (err) {
    return res.status(500).json({ EC: -1, EM: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productId } = req.params;
    const cart = await removeCartItemService(userId, productId);
    return res.json({ EC: 0, EM: 'Đã xóa sản phẩm khỏi giỏ', data: cart });
  } catch (err) {
    return res.status(500).json({ EC: -1, EM: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const cart = await clearCartService(userId);
    return res.json({ EC: 0, EM: 'Đã xóa toàn bộ giỏ hàng', data: cart });
  } catch (err) {
    return res.status(500).json({ EC: -1, EM: err.message });
  }
};
