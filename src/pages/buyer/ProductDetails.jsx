import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { formatPKR, CATEGORY_ICONS, formatDate } from '../../utils/helpers';

const Stars = ({ rating, size = 14 }) => (
  <span style={{ color: '#FFB800', fontSize: size }}>
    {'★'.repeat(Math.floor(rating))}
    {rating % 1 >= 0.5 ? '½' : ''}
    {'☆'.repeat(5 - Math.ceil(rating))}
  </span>
);

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('desc');

  const product = useMemo(() => storage.products.findById(id), [id]);
  const seller  = useMemo(() => product ? storage.users.findById(product.sellerId) : null, [product]);

  if (!product) return (
    <div className="page-wrapper"><Navbar />
      <div className="page-content"><div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontWeight: 700, marginBottom: '8px' }}>Product Not Found</h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>This product may have been removed.</p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div></div><Footer />
    </div>
  );

  const handleAddToCart = async (buyNow = false) => {
    if (!user) { toast.info('Please sign in to continue'); navigate('/login'); return; }
    if (user.role !== 'buyer') { toast.warning('Sellers cannot buy products'); return; }
    setAdding(true);
    addToCart(user.id, product.id, qty);
    toast.success(`${qty}x ${product.name} added to cart! 🛒`);
    setTimeout(() => { setAdding(false); if (buyNow) navigate('/cart'); }, 500);
  };

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 10;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span>
            <Link to="/products">Products</Link><span className="breadcrumb-sep">›</span>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-curr" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{product.name}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '20px', alignItems: 'start' }}>

            {/* Left — Image */}
            <div>
              <div style={{ background: '#f8f8f8', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.image ? (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '6rem', marginBottom: '8px' }}>{CATEGORY_ICONS[product.category] || '📦'}</div>
                    <div style={{ fontSize: '13px', color: '#bbb' }}>No image available</div>
                  </div>
                )}
              </div>
              {/* Trust badges */}
              <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[['🔒','Secure Payment'],['🚚','Free Shipping'],['↩️','7-Day Returns'],['⭐','Verified Seller']].map(([icon,text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 10px', background: '#fff', borderRadius: '6px', border: '1px solid #f0f0f0', fontSize: '11px', color: '#666', fontWeight: 500 }}>
                    <span>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Title & Badges */}
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-red">{product.category}</span>
                  {inStock && <span className="badge badge-green">✓ In Stock</span>}
                  {lowStock && <span className="badge badge-orange">Only {product.stock} left</span>}
                  {!inStock && <span className="badge-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600, background: '#f5f5f5', color: '#999' }}>Out of Stock</span>}
                </div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.4, marginBottom: '10px' }}>{product.name}</h1>

                {/* Rating Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <Stars rating={product.rating || 0} size={16} />
                  <span style={{ fontSize: '14px', color: '#E62E04', fontWeight: 700 }}>{product.rating?.toFixed(1) || '0.0'}</span>
                  <span style={{ fontSize: '13px', color: '#888' }}>{product.reviews || 0} reviews</span>
                  <span style={{ color: '#e0e0e0' }}>|</span>
                  <span style={{ fontSize: '13px', color: '#888' }}>{product.reviews || 0} sold</span>
                </div>
              </div>

              {/* Price */}
              <div style={{ background: '#FFF0EE', borderRadius: '8px', padding: '16px 20px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#E62E04', lineHeight: 1 }}>
                  {formatPKR(product.price)}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Inclusive of all taxes</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                  <span style={{ background: '#E62E04', color: '#fff', borderRadius: '3px', padding: '2px 6px', fontSize: '11px', fontWeight: 700 }}>FREE</span>
                  <span style={{ fontSize: '12px', color: '#00AE4D', fontWeight: 600 }}>Free Shipping to all Pakistan</span>
                </div>
              </div>

              {/* Quantity */}
              {inStock && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Quantity</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <button onClick={() => setQty(q => Math.max(1, q-1))} style={{ width: '36px', height: '36px', background: '#f5f5f5', border: 'none', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#444', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>−</button>
                      <span style={{ width: '48px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>{qty}</span>
                      <button onClick={() => setQty(q => Math.min(product.stock, q+1))} style={{ width: '36px', height: '36px', background: '#f5f5f5', border: 'none', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#444', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e8e8e8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}>+</button>
                    </div>
                    <span style={{ fontSize: '12px', color: '#888' }}>{product.stock} available</span>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => handleAddToCart(false)} disabled={!inStock || adding} className="btn btn-outline-red" style={{ height: '48px', flex: 1, fontSize: '15px' }}>
                  🛒 Add to Cart
                </button>
                <button onClick={() => handleAddToCart(true)} disabled={!inStock} className="btn btn-primary" style={{ height: '48px', flex: 1, fontSize: '15px' }}>
                  ⚡ Buy Now
                </button>
              </div>

              {/* Seller Card */}
              {seller && (
                <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '16px', background: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '14px', overflow: 'hidden', flexShrink: 0 }}>
                      {seller.profile?.avatar ? <img src={seller.profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : seller.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A1A' }}>{seller.profile?.businessName || seller.name}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        <Stars rating={seller.rating || 4.5} size={11} />
                        <span style={{ marginLeft: '4px' }}>{(seller.rating || 4.5).toFixed(1)} · {seller.totalOrders || 0} orders</span>
                      </div>
                    </div>
                    <span className="badge badge-green">✓ Verified</span>
                  </div>
                  {seller.profile?.address && (
                    <div style={{ fontSize: '12px', color: '#888' }}>📍 {seller.profile.address}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ marginTop: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
              {[['desc','Description'],['spec','Specifications'],['reviews','Reviews']].map(([key,label]) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding: '14px 24px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: activeTab === key ? 700 : 400,
                  color: activeTab === key ? '#E62E04' : '#555',
                  borderBottom: activeTab === key ? '2px solid #E62E04' : '2px solid transparent',
                  marginBottom: '-1px', transition: 'all 0.15s',
                }}>{label}</button>
              ))}
            </div>
            <div style={{ padding: '24px' }}>
              {activeTab === 'desc' && (
                <div>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#444' }}>{product.description || 'No description provided.'}</p>
                </div>
              )}
              {activeTab === 'spec' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[['Category', product.category], ['Brand', seller?.profile?.businessName || 'VENDORA Seller'], ['Stock', `${product.stock} units`], ['Listed', formatDate(product.createdAt)], ['Condition', 'New']].map(([k,v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, fontSize: '13px', color: '#888', background: '#fafafa', width: '40%' }}>{k}</td>
                        <td style={{ padding: '10px 16px', fontSize: '13px', color: '#1A1A1A' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'reviews' && (
                <div>
                  {product.reviews > 0 ? (
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '20px', background: '#fafafa', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#E62E04' }}>{(product.rating || 0).toFixed(1)}</div>
                        <Stars rating={product.rating || 0} size={18} />
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{product.reviews} reviews</div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[5,4,3,2,1].map(n => (
                          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <span style={{ color: '#FFB800', width: '14px', textAlign: 'right' }}>{n}★</span>
                            <div style={{ flex: 1, height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.max(5, (5-n+1)*18)}%`, background: '#FFB800', borderRadius: '3px' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state" style={{ padding: '40px' }}>
                      <div className="empty-state-icon">💬</div>
                      <div className="empty-state-title">No reviews yet</div>
                      <div className="empty-state-desc">Be the first to review this product!</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
