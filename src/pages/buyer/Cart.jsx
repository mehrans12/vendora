import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { formatPKR, CATEGORY_ICONS } from '../../utils/helpers';

export default function Cart() {
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const cartItems = cart?.items || [];
  const allProducts = useMemo(() => storage.products.getAll(), []);

  const enriched = useMemo(() =>
    cartItems.map(item => ({
      ...item,
      product: allProducts.find(p => p.id === item.productId),
    })).filter(i => i.product),
    [cartItems, allProducts]
  );

  const subtotal = enriched.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleQty = (productId, qty) => {
    if (!user) return;
    if (qty < 1) { removeFromCart(user.id, productId); toast.info('Item removed'); return; }
    updateQuantity(user.id, productId, qty);
  };

  const handleRemove = (productId, name) => {
    if (!user) return;
    removeFromCart(user.id, productId);
    toast.success(`${name} removed from cart`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span className="breadcrumb-curr">Shopping Cart</span></div>

          {enriched.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', padding: '0' }}>
              <div className="empty-state" style={{ padding: '80px 24px' }}>
                <div className="empty-state-icon">🛒</div>
                <div className="empty-state-title">Your cart is empty</div>
                <div className="empty-state-desc">Looks like you haven't added any products yet.</div>
                <Link to="/products" className="btn btn-primary" style={{ marginTop: '8px' }}>Start Shopping</Link>
              </div>
            </div>
          ) : (
            <div className="resp-grid-cart">

              {/* Cart Items */}
              <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>🛒 Shopping Cart</span>
                  <span className="badge badge-red">{enriched.length} items</span>
                </div>

                {enriched.map((item, i) => (
                  <div key={item.productId} style={{ display: 'flex', gap: '16px', padding: '16px 20px', borderBottom: i < enriched.length - 1 ? '1px solid #f5f5f5' : 'none', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Product Image */}
                    <Link to={`/products/${item.productId}`} style={{ flexShrink: 0 }}>
                      <div style={{ width: '88px', height: '88px', borderRadius: '6px', overflow: 'hidden', background: '#f8f8f8', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.product.image
                          ? <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[item.product.category] || '📦'}</span>}
                      </div>
                    </Link>

                    {/* Details */}
                    <div style={{ flex: 1 }}>
                      <Link to={`/products/${item.productId}`} style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, textDecoration: 'none' }}>
                        {item.product.name}
                      </Link>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{item.product.sellerName || 'VENDORA Seller'}</div>
                      {item.product.stock <= 5 && item.product.stock > 0 && (
                        <span style={{ fontSize: '11px', color: '#FF6A00', fontWeight: 600 }}>⚠️ Only {item.product.stock} left</span>
                      )}
                    </div>

                    {/* Qty + Price */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#E62E04' }}>{formatPKR(item.product.price * item.quantity)}</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>{formatPKR(item.product.price)} each</span>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                        <button onClick={() => handleQty(item.productId, item.quantity - 1)} style={{ width: '30px', height: '30px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>−</button>
                        <span style={{ width: '40px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>{item.quantity}</span>
                        <button onClick={() => handleQty(item.productId, item.quantity + 1)} disabled={item.quantity >= item.product.stock} style={{ width: '30px', height: '30px', background: '#f5f5f5', border: 'none', cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: item.quantity >= item.product.stock ? 0.4 : 1, transition: 'background 0.15s' }}
                          onMouseEnter={e => { if (item.quantity < item.product.stock) e.currentTarget.style.background = '#e8e8e8'; }}
                          onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>+</button>
                      </div>
                      <button onClick={() => handleRemove(item.productId, item.product.name)} style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#E62E04'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888'}>🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden', position: 'sticky', top: '16px' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '15px' }}>Order Summary</div>
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                    <span>Subtotal ({enriched.length} items)</span><span style={{ fontWeight: 600 }}>{formatPKR(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#00AE4D', fontWeight: 600 }}>
                    <span>🚚 Shipping</span><span>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                    <span>Tax</span><span>PKR 0</span>
                  </div>
                  <div style={{ height: '1px', background: '#f0f0f0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                    <span>Total</span><span style={{ color: '#E62E04' }}>{formatPKR(subtotal)}</span>
                  </div>
                </div>
                <div style={{ padding: '0 20px 20px' }}>
                  <button onClick={() => { if (!user) { navigate('/login'); return; } navigate('/checkout'); }} className="btn btn-primary btn-full" style={{ height: '48px', fontSize: '15px', fontWeight: 800 }}>
                    Proceed to Checkout →
                  </button>
                  <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '10px', fontSize: '13px', color: '#E62E04', fontWeight: 600 }}>
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Trust */}
                <div style={{ padding: '14px 20px', background: '#fafafa', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['🔒 Secure Checkout','🛡️ Buyer Protection','🚚 Free Shipping'].map(t => (
                    <div key={t} style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
