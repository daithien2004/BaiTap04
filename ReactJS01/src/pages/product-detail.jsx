import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Button,
  Row,
  Col,
  Spin,
  message,
  Space,
  InputNumber,
  Typography,
  Divider,
} from 'antd';
import {
  addFavoriteApi,
  removeFavoriteApi,
  postProductViewApi,
  getSimilarProductsApi,
  getProductStatsApi,
  getProductByIdApi,
  addToCartApi,
} from '../util/api';
import CommentSection from './comment-section';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [stats, setStats] = useState({ buyers: 0, comments: 0, orders: 0 });
  const [quantity, setQuantity] = useState(1);
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getProductByIdApi(productId);
        if (res?.EC === 0) {
          const product = res.data;
          setProduct(product);
          setIsFavorite(product.isFavorite || false);
        } else {
          message.error(res?.EM || 'Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error(err);
        message.error('Lỗi khi tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    postProductViewApi(product._id).catch(() => {});

    getSimilarProductsApi(product._id)
      .then((res) => {
        if (res?.EC === 0) setSimilar(res.data || []);
      })
      .catch(() => {});

    getProductStatsApi(product._id)
      .then((res) => {
        if (res?.EC === 0) setStats(res.data || {});
      })
      .catch(() => {});
  }, [product]);

  const toggleFavorite = async () => {
    if (!product) return;
    try {
      if (!isFavorite) {
        const r = await addFavoriteApi(product._id);
        if (r?.EC === 0 || r?.data?.EC === 0) {
          setIsFavorite(true);
          message.success('Đã thêm vào yêu thích');
        }
      } else {
        await removeFavoriteApi(product._id);
        setIsFavorite(false);
        message.success('Đã gỡ yêu thích');
      }
    } catch (err) {
      console.error(err);
      message.error('Lỗi');
    }
  };

  const handleAddToCart = async () => {
    if (quantity < 1) {
      message.warning('Số lượng phải lớn hơn 0');
      return;
    }
    try {
      setAddingCart(true);
      await addToCartApi(productId, quantity);
      if (res?.EC === 0) {
        setQuantity(0);
        message.success('Đã thêm sản phẩm vào giỏ hàng');
      } else {
        message.error(res?.EM || 'Không thể thêm vào giỏ hàng');
      }
    } catch (err) {
      message.error('Lỗi khi thêm vào giỏ hàng');
    } finally {
      setAddingCart(false);
    }
  };

  if (loading || !product) return <Spin fullscreen />;

  return (
    <div style={{ padding: 24 }}>
      <Card
        bordered={false}
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
      >
        <Row gutter={24}>
          <Col xs={24} md={10}>
            <img
              src={product.thumbnail}
              alt={product.name}
              style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
            />
          </Col>

          <Col xs={24} md={14}>
            <Title level={3}>{product.name}</Title>
            <Paragraph type="secondary">{product.description}</Paragraph>

            <Space size="middle" style={{ marginBottom: 16 }}>
              <Button
                type={isFavorite ? 'primary' : 'default'}
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                onClick={toggleFavorite}
              >
                {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              </Button>
            </Space>

            <div style={{ marginBottom: 12 }}>
              <Text strong>👥 {stats.buyers} khách đã mua</Text> •{' '}
              <Text strong>💬 {stats.comments} bình luận</Text>
            </div>

            <Space align="center" style={{ marginTop: 16 }}>
              <Text>Số lượng:</Text>
              <InputNumber
                min={1}
                max={product?.stock || 99}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
              />
            </Space>

            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              loading={addingCart}
              size="large"
              block
              style={{ marginTop: 20, borderRadius: 8 }}
            >
              Thêm vào giỏ hàng
            </Button>
          </Col>
        </Row>
      </Card>

      <Divider />

      <CommentSection
        productId={product._id}
        onCommentAdded={() =>
          setStats((prev) => ({ ...prev, comments: prev.comments + 1 }))
        }
        onCommentDeleted={() =>
          setStats((prev) => ({ ...prev, comments: prev.comments - 1 }))
        }
      />

      <Divider />

      <Title level={4}>Sản phẩm tương tự</Title>
      <Row gutter={[16, 16]}>
        {similar.map((p) => (
          <Col key={p._id} xs={12} sm={8} md={6}>
            <Card
              hoverable
              style={{ borderRadius: 10 }}
              cover={
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  style={{
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: '10px 10px 0 0',
                  }}
                />
              }
            >
              <Card.Meta
                title={<Text strong>{p.name}</Text>}
                description={new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(p.price)}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductDetail;
