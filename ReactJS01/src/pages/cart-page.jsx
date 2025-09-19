import { useEffect, useState } from 'react';
import { List, Button, InputNumber, message, Divider } from 'antd';
import {
  getCartApi,
  updateToCartApi,
  removeFromCartApi,
  createOrderApi,
} from '../util/api';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCartApi();
      if (res?.EC === 0) {
        setCart(res.data?.items || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    const res = await updateToCartApi(productId, quantity);
    if (res?.EC === 0) {
      fetchCart();
    } else {
      message.error(res?.EM || 'Cập nhật thất bại');
    }
  };

  const handleRemove = async (productId) => {
    const res = await removeFromCartApi(productId);
    if (res?.EC === 0) {
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
      fetchCart();
    } else {
      message.error(res?.EM || 'Xóa thất bại');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      message.warning('Giỏ hàng đang trống!');
      return;
    }

    try {
      const res = await createOrderApi();
      if (res?.EC === 0) {
        message.success('Thanh toán thành công 🎉');
        setCart([]); // clear UI giỏ hàng
      } else {
        message.error(res?.EM || 'Thanh toán thất bại');
      }
    } catch (err) {
      message.error('Có lỗi xảy ra khi thanh toán');
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h2>🛒 Giỏ hàng</h2>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={(item) => (
          <List.Item
            actions={[
              <InputNumber
                min={1}
                value={item.quantity}
                onChange={(val) =>
                  handleQuantityChange(item.productId._id, val)
                }
              />,
              <Button danger onClick={() => handleRemove(item.productId._id)}>
                Xóa
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={item.productId?.name}
              description={`Giá: ${item.productId?.price}₫`}
            />
            <div>Tổng: {item.productId?.price * item.quantity}₫</div>
          </List.Item>
        )}
      />

      {/* Thanh toán */}
      <Divider />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 16,
        }}
      >
        <span>Tổng cộng:</span>
        <span>{getTotalPrice()}₫</span>
      </div>
      <Button
        type="primary"
        size="large"
        block
        disabled={cart.length === 0}
        onClick={handleCheckout}
      >
        Thanh toán
      </Button>
    </div>
  );
};

export default CartPage;
