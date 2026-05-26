import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import { formatPKR, CATEGORY_ICONS } from '../../utils/helpers';

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="ali-stars">
      {[1,2,3,4,5].map(i =>
        i <= full ? '★' : (i === full + 1 && half ? '½' : '☆')
      ).join('')}
    </span>
  );
};

export const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.info('Please sign in to add items to cart'); navigate('/login'); return; }
    if (user.role !== 'buyer') { toast.warning('Sellers cannot buy items'); return; }
    if (product.stock === 0) { toast.error('This product is out of stock'); return; }
    addToCart(user.id, product.id, 1);
    toast.success(`Added to cart! 🛒`);
  };

  const isHot    = product.reviews > 40;
  const isNew    = !product.reviews || product.reviews < 5;
  const isLow    = product.stock > 0 && product.stock <= 5;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="ali-product-card">

        {/* Ribbon */}
        {isHot && !isNew && <div className="ribbon">🔥 Hot</div>}
        {isNew && <div className="ribbon ribbon-green">New</div>}
        {isLow && <div className="ribbon ribbon-orange">Only {product.stock} left</div>}

        {/* Image */}
        <div className="ali-product-img">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(135deg, #fafafa, #f0f0f0)' }}>
              <span style={{ fontSize: '3rem' }}>{CATEGORY_ICONS[product.category] || '📦'}</span>
              <span style={{ fontSize: '11px', color: '#bbb', fontWeight: 600 }}>{product.category}</span>
            </div>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ background: '#fff', color: '#666', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '4px' }}>Out of Stock</span>
            </div>
          )}
          {product.stock > 0 && (
            <div className="ali-cart-overlay" onClick={handleAddToCart}>
              🛒 Add to Cart
            </div>
          )}
        </div>

        {/* Info */}
        <div className="ali-product-info">
          <p className="ali-product-title">{product.name}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
            <span className="ali-product-price">{formatPKR(product.price)}</span>
          </div>

          <div className="ali-product-meta">
            {product.rating > 0 && (
              <>
                <StarRating rating={product.rating} />
                <span>({product.reviews || 0})</span>
                <span style={{ color: '#ddd' }}>·</span>
              </>
            )}
            <span className="ali-free-ship">Free Ship</span>
            {product.reviews > 0 && (
              <>
                <span style={{ color: '#ddd' }}>·</span>
                <span>{product.reviews > 999 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews} sold</span>
              </>
            )}
          </div>

          <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.sellerName || 'VENDORA Seller'}
          </div>
        </div>
      </div>
    </Link>
  );
};
