import {
  createOrderService,
  getUserOrdersService,
} from '../services/orderService.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const order = await createOrderService(userId);
    return res.json({ EC: 0, EM: 'Đặt hàng thành công', data: order });
  } catch (err) {
    return res.status(400).json({ EC: -1, EM: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const orders = await getUserOrdersService(userId);
    return res.json({ EC: 0, EM: 'OK', data: orders });
  } catch (err) {
    return res.status(500).json({ EC: -1, EM: err.message });
  }
};
