import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { formatPKR, CATEGORY_ICONS } from '../../utils/helpers';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    city: '', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);

  const allProducts = useMemo(() => storage.products.getAll(), []);
  const cartItems = cart?.items || [];
  const enriched = useMemo(() =>
    cartItems.map(i => ({ ...i, product: allProducts.find(p => p.id === i.productId) })).filter(i => i.product),
    [cartItems, allProducts]
  );
  const subtotal = enriched.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Delivery address is required';
    if (!form.city.trim())    e.city    = 'City is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!enriched.length) { toast.error('Cart is empty'); return; }
    setPlacing(true);

    // Group by seller and place orders
    const bySellerMap = {};
    enriched.forEach(item => {
      const sid = item.product.sellerId || 'unknown';
      if (!bySellerMap[sid]) bySellerMap[sid] = [];
      bySellerMap[sid].push(item);
    });

    const orderIds = [];
    Object.entries(bySellerMap).forEach(([sellerId, items]) => {
      const order = storage.orders.create({
        buyerId: user.id,
        buyerName: form.name,
        sellerId,
        items: items.map(i => ({ productId: i.productId, productName: i.product.name, quantity: i.quantity, price: i.product.price })),
        totalAmount: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
        shippingAddress: `${form.address}, ${form.city}`,
        buyerPhone: form.phone,
        notes: form.notes,
      });
      orderIds.push(order.id);
    });

    clearCart(user.id);
    setDone(orderIds[0]);
    setPlacing(false);
    toast.success('🎉 Order placed successfully!');
  };

  if (done) return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container" style={{ maxWidth: '560px', margin: '0 auto', paddingTop: '40px', paddingBottom: '40px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8', padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', background: '#E8F9EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', margin: '0 auto 20px' }}>✅</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '8px' }}>Order Placed!</h2>
            <p style={{ color: '#888', marginBottom: '8px' }}>Thank you, <strong>{form.name}</strong>!</p>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '13px' }}>Your order has been placed successfully. The seller will confirm it shortly.</p>
            <div style={{ background: '#fafafa', borderRadius: '8px', padding: '14px', marginBottom: '24px', border: '1px solid #f0f0f0', fontSize: '13px' }}>
              <div style={{ color: '#888', marginBottom: '4px' }}>Order ID</div>
              <div style={{ fontWeight: 700, color: '#E62E04', fontFamily: 'monospace', fontSize: '12px' }}>{done}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-primary">View My Orders</Link>
              <Link to="/products" className="btn btn-ghost">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><Link to="/cart">Cart</Link><span className="breadcrumb-sep">›</span><span className="breadcrumb-curr">Checkout</span></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '15px' }}>📦 Shipping Details</div>
              <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name <span style={{ color: '#E62E04' }}>*</span></label>
                    <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone <span style={{ color: '#E62E04' }}>*</span></label>
                    <input className={`form-input ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 3XX XXXXXXX" />
                    {errors.phone && <div className="form-error">{errors.phone}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">City <span style={{ color: '#E62E04' }}>*</span></label>
                    <input className={`form-input ${errors.city ? 'error' : ''}`} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Karachi" />
                    {errors.city && <div className="form-error">{errors.city}</div>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Address <span style={{ color: '#E62E04' }}>*</span></label>
                  <textarea className={`form-textarea ${errors.address ? 'error' : ''}`} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address, area, postal code..." rows={3} />
                  {errors.address && <div className="form-error">{errors.address}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Special instructions for the seller..." rows={2} />
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#1A1A1A' }}>Payment Method</div>
                  {['Cash on Delivery', 'Bank Transfer', 'JazzCash / EasyPaisa'].map((method, i) => (
                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', border: `1px solid ${i === 0 ? '#E62E04' : '#e0e0e0'}`, borderRadius: '6px', marginBottom: '6px', cursor: 'pointer', background: i === 0 ? '#FFF0EE' : '#fafafa' }}>
                      <input type="radio" name="payment" defaultChecked={i === 0} style={{ accentColor: '#E62E04' }} />
                      <span style={{ fontSize: '13px', fontWeight: i === 0 ? 700 : 400, color: i === 0 ? '#E62E04' : '#555' }}>{method}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" disabled={placing || !enriched.length} className="btn btn-primary btn-full" style={{ height: '50px', fontSize: '16px', fontWeight: 800 }}>
                  {placing ? 'Placing Order...' : `🔒 Place Order — ${formatPKR(subtotal)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden', position: 'sticky', top: '16px' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '14px' }}>Order Summary ({enriched.length} items)</div>
              <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                {enriched.map(item => (
                  <div key={item.productId} style={{ display: 'flex', gap: '10px', padding: '12px 16px', borderBottom: '1px solid #f5f5f5', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: '#f8f8f8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8e8e8' }}>
                      {item.product.image ? <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.4rem' }}>{CATEGORY_ICONS[item.product.category] || '📦'}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product.name}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Qty: {item.quantity}</div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#E62E04', flexShrink: 0 }}>{formatPKR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
                  <span>Subtotal</span><span style={{ fontWeight: 600 }}>{formatPKR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#00AE4D', fontWeight: 600 }}>
                  <span>Shipping</span><span>FREE</span>
                </div>
                <div style={{ height: '1px', background: '#f0f0f0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                  <span>Total</span><span style={{ color: '#E62E04' }}>{formatPKR(subtotal)}</span>
                </div>
              </div>
              <div style={{ padding: '12px 20px', background: '#fafafa', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['🔒 SSL Secured Checkout','🛡️ Buyer Protection Guaranteed'].map(t => (
                  <div key={t} style={{ fontSize: '11px', color: '#888' }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
