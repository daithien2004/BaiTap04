import { useEffect, useRef, useState } from 'react';
import { Select, Card, Row, Col, Spin, Empty, Input, Button, Slider, Checkbox, Collapse } from 'antd';
import {
  getCategoriesApi,
  getProductsApi,
  searchProductApi,
} from '../util/api';

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
  const [query, setQuery] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    hasDiscount: false,
    minViews: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoriesApi();
      setCategories(res || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // reset when category or filters change
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchedPagesRef.current.clear();
  }, [selectedCategory, filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasMore) return;
      if (fetchingRef.current) return;
      if (fetchedPagesRef.current.has(`${selectedCategory || ''}:${page}`))
        return;
      fetchingRef.current = true;
      setLoading(true);
      try {
        const res = await getProductsApi({
          category: selectedCategory,
          page,
          limit: PAGE_SIZE,
          ...filters
        });
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
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loading &&
          !fetchingRef.current
        ) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleSearch = async () => {
    const q = query;
    if (!query.trim()) return;
    const res = await searchProductApi(query);
    setProducts(res.data);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 10000000,
      hasDiscount: false,
      minViews: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Input
          style={{ marginBottom: 16 }}
          type="text"
          placeholder="Tìm sản phẩm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Chọn danh mục"
          style={{ width: 300, marginRight: 16 }}
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>

      <Collapse style={{ marginBottom: 16 }}
        items={[
          {
            key: '1',
            label: 'Bộ lọc nâng cao',
            children: (
              <div style={{ padding: '16px 0' }}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div>
                      <label>Khoảng giá (VNĐ)</label>
                      <Slider
                        range
                        min={0}
                        max={10000000}
                        step={100000}
                        value={[filters.minPrice, filters.maxPrice]}
                        onChange={(value) => {
                          handleFilterChange('minPrice', value[0]);
                          handleFilterChange('maxPrice', value[1]);
                        }}
                        tooltip={{
                          formatter: (value) => `${value?.toLocaleString('vi-VN')} VNĐ`
                        }}
                      />
                    </div>
                  </Col>
                  
                  <Col span={8}>
                    <div>
                      <label>Lượt xem tối thiểu</label>
                      <Input
                        type="number"
                        placeholder="Nhập số lượt xem"
                        value={filters.minViews}
                        onChange={(e) => handleFilterChange('minViews', e.target.value)}
                      />
                    </div>
                  </Col>
                  
                  <Col span={8}>
                    <div>
                      <label>Sắp xếp theo</label>
                      <Select
                        style={{ width: '100%', marginBottom: 8 }}
                        value={filters.sortBy}
                        onChange={(value) => handleFilterChange('sortBy', value)}
                        options={[
                          { value: 'createdAt', label: 'Ngày tạo' },
                          { value: 'price', label: 'Giá' },
                          { value: 'views', label: 'Lượt xem' },
                          { value: 'discount', label: 'Khuyến mãi' }
                        ]}
                      />
                      <Select
                        style={{ width: '100%' }}
                        value={filters.sortOrder}
                        onChange={(value) => handleFilterChange('sortOrder', value)}
                        options={[
                          { value: 'desc', label: 'Giảm dần' },
                          { value: 'asc', label: 'Tăng dần' }
                        ]}
                      />
                    </div>
                  </Col>
                </Row>
                
                <div style={{ marginTop: 16 }}>
                  <Checkbox
                    checked={filters.hasDiscount}
                    onChange={(e) => handleFilterChange('hasDiscount', e.target.checked)}
                  >
                    Chỉ hiển thị sản phẩm có khuyến mãi
                  </Checkbox>
                </div>
              </div>
            ),
          },
        ]}
      />

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
                    src={
                      p.thumbnail ||
                      'https://via.placeholder.com/300x200?text=No+Image'
                    }
                    style={{ height: 160, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={p.name}
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>
                        {p.discount > 0 ? (
                          <div>
                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: 8 }}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(p.price || 0)}
                            </span>
                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format((p.price * (100 - p.discount)) / 100)}
                            </span>
                            <span style={{ color: '#ff4d4f', marginLeft: 4 }}>
                              -{p.discount}%
                            </span>
                          </div>
                        ) : (
                          <span>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(p.price || 0)}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        👁️ {p.views || 0} lượt xem
                      </div>
                    </div>
                  }
                />
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
