import { useEffect, useRef, useState } from 'react';
import {
  Select,
  Card,
  Row,
  Col,
  Spin,
  Empty,
  Input,
  Button,
  Slider,
  Checkbox,
  Collapse,
} from 'antd';
import {
  getCategoriesApi,
  getProductsApi,
  searchProductApi,
} from '../util/api';
import ProductCard from './product-card';

const PAGE_SIZE = 12;

const HomePage = () => {
  const [mode, setMode] = useState('normal'); // 'normal' | 'search'
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
    maxPrice: null,
    hasDiscount: false,
    minViews: 0,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoriesApi();
      setCategories(res || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // reset khi category, filters hoặc query thay đổi
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchedPagesRef.current.clear();
  }, [selectedCategory, filters, query, mode]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!hasMore) return;
      if (fetchingRef.current) return;
      if (
        fetchedPagesRef.current.has(
          `${mode}:${selectedCategory || ''}:${query}:${page}`
        )
      )
        return;

      fetchingRef.current = true;
      setLoading(true);
      try {
        let res;
        if (mode === 'normal') {
          res = await getProductsApi({
            category: selectedCategory,
            page,
            limit: PAGE_SIZE,
            ...filters,
          });
        } else {
          res = await searchProductApi(query, page, PAGE_SIZE);
        }

        setProducts((prev) =>
          page === 1 ? res?.items || [] : [...prev, ...(res?.items || [])]
        );
        setHasMore(!!res?.hasMore);
        fetchedPagesRef.current.add(
          `${mode}:${selectedCategory || ''}:${query}:${page}`
        );
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    };

    // 👉 gọi ngay khi page = 1 (sau khi reset filters/search/category)
    fetchProducts();
  }, [page, selectedCategory, query, mode, filters, hasMore]);

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

  const handleSearch = () => {
    if (!query || query.trim() === '') {
      setMode('normal');
    } else {
      setMode('search');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 👉 Hàm reset filter
  const resetFilters = () => {
    setSelectedCategory(undefined);
    setFilters({
      minPrice: 0,
      maxPrice: null,
      hasDiscount: false,
      minViews: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchedPagesRef.current.clear();
    setMode('normal');
    setQuery('');
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <Input
          style={{ marginBottom: 16 }}
          type="text"
          placeholder="Tìm sản phẩm"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            setMode(value.trim() === '' ? 'normal' : 'search'); // ✅ auto switch mode
          }}
        />
        <Button onClick={handleSearch} style={{ marginRight: 8 }}>
          Search
        </Button>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Select
          allowClear
          placeholder="Chọn danh mục"
          style={{ width: 300, marginRight: 16 }}
          value={selectedCategory}
          onChange={(value) => {
            setSelectedCategory(value);
            setMode('normal'); // reset về normal khi đổi category
          }}
          options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        />
      </div>

      <Collapse
        style={{ marginBottom: 16 }}
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
                        max={100000000}
                        step={100000}
                        value={[filters.minPrice, filters.maxPrice]}
                        onChange={(value) => {
                          handleFilterChange('minPrice', value[0]);
                          handleFilterChange('maxPrice', value[1]);
                        }}
                        tooltip={{
                          formatter: (value) =>
                            `${value?.toLocaleString('vi-VN')} VNĐ`,
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
                        onChange={(e) =>
                          handleFilterChange('minViews', e.target.value)
                        }
                      />
                    </div>
                  </Col>

                  <Col span={8}>
                    <div>
                      <label>Sắp xếp theo</label>
                      <Select
                        style={{ width: '100%', marginBottom: 8 }}
                        value={filters.sortBy}
                        onChange={(value) =>
                          handleFilterChange('sortBy', value)
                        }
                        options={[
                          { value: 'createdAt', label: 'Ngày tạo' },
                          { value: 'price', label: 'Giá' },
                          { value: 'views', label: 'Lượt xem' },
                          { value: 'discount', label: 'Khuyến mãi' },
                        ]}
                      />
                      <Select
                        style={{ width: '100%' }}
                        value={filters.sortOrder}
                        onChange={(value) =>
                          handleFilterChange('sortOrder', value)
                        }
                        options={[
                          { value: 'desc', label: 'Giảm dần' },
                          { value: 'asc', label: 'Tăng dần' },
                        ]}
                      />
                    </div>
                  </Col>
                </Row>

                <div style={{ marginTop: 16 }}>
                  <Checkbox
                    checked={filters.hasDiscount}
                    onChange={(e) =>
                      handleFilterChange('hasDiscount', e.target.checked)
                    }
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
              <ProductCard product={p} />
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
