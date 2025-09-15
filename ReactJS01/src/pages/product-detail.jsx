import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Spin, message } from 'antd';
import {
  addFavoriteApi,
  removeFavoriteApi,
  postProductViewApi,
  getSimilarProductsApi,
  getProductStatsApi,
  getProductByIdApi,
} from '../util/api';

const ProductDetail = () => {
  const { productId } = useParams(); // tùy route của bạn
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [similar, setSimilar] = useState([]);
  const [stats, setStats] = useState({ buyers: 0, comments: 0, orders: 0 });

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getProductByIdApi(productId); // res = {EC, EM, data}

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
    // mark viewed
    postProductViewApi(product._id).catch(() => {});
    // load similar
    getSimilarProductsApi(product._id)
      .then((r) => {
        if (r?.data?.EC === 0) setSimilar(r.data.data || r.data);
        else if (r?.data?.data) setSimilar(r.data.data);
      })
      .catch(() => {});
    // load stats
    getProductStatsApi(product._id)
      .then((r) => {
        if (r?.data?.EC === 0) setStats(r.data.data || r.data);
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
        } else message.success('Đã thêm');
      } else {
        const r = await removeFavoriteApi(product._id);
        setIsFavorite(false);
        message.success('Đã gỡ yêu thích');
      }
    } catch (err) {
      console.error(err);
      message.error('Lỗi');
    }
  };

  if (loading || !product) return <Spin />;

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={10}>
          <img
            src={product.thumbnail}
            alt={product.name}
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </Col>
        <Col span={14}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div style={{ marginBottom: 12 }}>
            <Button onClick={toggleFavorite}>
              {isFavorite ? 'Bỏ yêu thích' : 'Thêm yêu thích'}
            </Button>
          </div>
          <div style={{ marginBottom: 12 }}>
            👥 {stats.buyers} khách đã mua • 💬 {stats.comments} bình luận
          </div>
        </Col>
      </Row>

      <h3 style={{ marginTop: 24 }}>Sản phẩm tương tự</h3>
      <Row gutter={[16, 16]}>
        {similar.map((p) => (
          <Col key={p._id} xs={12} sm={8} md={6}>
            <Card
              hoverable
              cover={
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  style={{ height: 120, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={p.name}
                description={`${new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(p.price)}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductDetail;
