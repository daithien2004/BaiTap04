import { useEffect, useState } from 'react';
import { getFavoritesApi } from '../util/api';
import { Row, Col, Card, Spin, Empty, Typography } from 'antd';

const { Title } = Typography;

const Favorites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFavoritesApi()
      .then((r) => {
        if (r?.EC === 0) {
          setItems(r.data.items || []);
        } else {
          setItems([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin />;
  if (!items.length) return <Empty description="Không có sản phẩm yêu thích" />;

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Sản phẩm yêu thích</Title>
      {loading ? (
        <Spin />
      ) : items.length === 0 ? (
        <Empty description="Chưa có sản phẩm nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((p) => (
            <Col key={p._id} xs={12} sm={8} md={6} lg={4}>
              <Card
                hoverable
                cover={
                  <img
                    src={p.thumbnail}
                    style={{ height: 120, objectFit: 'cover' }}
                    alt={p.name}
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
      )}
    </div>
  );
};

export default Favorites;
