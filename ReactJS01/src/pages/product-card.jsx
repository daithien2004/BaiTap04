import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      cover={
        <img
          alt={product.name}
          src={
            product.thumbnail ||
            'https://via.placeholder.com/300x200?text=No+Image'
          }
          style={{ height: 160, objectFit: 'cover' }}
        />
      }
    >
      <Card.Meta
        title={product.name}
        description={
          <div>
            <div style={{ marginBottom: 4 }}>
              {product.discount > 0 ? (
                <div>
                  <span
                    style={{
                      textDecoration: 'line-through',
                      color: '#999',
                      marginRight: 8,
                    }}
                  >
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(product.price || 0)}
                  </span>
                  <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format((product.price * (100 - product.discount)) / 100)}
                  </span>
                  <span style={{ color: '#ff4d4f', marginLeft: 4 }}>
                    -{product.discount}%
                  </span>
                </div>
              ) : (
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.price || 0)}
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              👁️ {product.views || 0} lượt xem
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
