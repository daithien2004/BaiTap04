import { useEffect, useRef, useState } from 'react';
import { Select, Card, Row, Col, Spin, Empty } from 'antd';
import { getCategoriesApi, getProductsApi } from '../util/api';

const PAGE_SIZE = 12;

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);
  const fetchingRef = useRef(false);
  const fetchedPagesRef = useRef(new Set());

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoriesApi();
      setCategories(res || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // reset when category changes
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasMore) return;
      if (fetchingRef.current) return;
      if (fetchedPagesRef.current.has(`${selectedCategory || ''}:${page}`)) return;
      fetchingRef.current = true;
      setLoading(true);
      try {
        const res = await getProductsApi({ category: selectedCategory, page, limit: PAGE_SIZE });
        setProducts((prev) => [...prev, ...(res?.items || [])]);
        setHasMore(!!res?.hasMore);
        fetchedPagesRef.current.add(`${selectedCategory || ''}:${page}`);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, selectedCategory, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !fetchingRef.current) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Chọn danh mục"
          style={{ width: 300 }}
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />
      </div>

      {products.length === 0 && !loading ? (
        <Empty description="Không có sản phẩm" />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col key={p._id} xs={12} sm={8} md={6} lg={6} xl={4}>
              <Card
                hoverable
                cover={
                  <img
                    alt={p.name}
                    src={p.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'}
                    style={{ height: 160, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta title={p.name} description={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price || 0)} />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
          <Spin />
        </div>
      )}
    </div>
  );
};
export default HomePage;
