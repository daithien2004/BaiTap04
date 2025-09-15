import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Empty, Typography } from 'antd';
import { getRecentViewsApi } from '../util/api';

const { Title } = Typography;

const RecentViews = () => {
  const [loading, setLoading] = useState(false);
  const [recentViews, setRecentViews] = useState([]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        setLoading(true);
        const res = await getRecentViewsApi(12); // lấy 12 sản phẩm gần nhất
        if (res?.EC === 0) {
          setRecentViews(res.data || []);
        }
      } catch (error) {
        console.error('Lỗi load recent views:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Sản phẩm đã xem gần đây</Title>
      {loading ? (
        <Spin />
      ) : recentViews.length === 0 ? (
        <Empty description="Chưa có sản phẩm nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {recentViews.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.thumbnail || 'https://via.placeholder.com/200'}
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={product.name}
                  description={`${product.price?.toLocaleString()} ₫`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RecentViews;
