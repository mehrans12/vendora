import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import * as storage from '../../utils/storage';
import { formatPKR, formatDate, statusClass } from '../../utils/helpers';

const TABS = ['Orders', 'Profile'];
const STATUS_STEPS = ['pending','confirmed','shipped','delivered'];

export default function BuyerDashboard() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Orders');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '', phone: user?.profile?.phone || '', address: user?.profile?.address || '',
  });
  const [saved, setSaved] = useState(false);

  const orders = useMemo(() => user ? storage.orders.findByBuyerId(user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) : [], [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name: profileForm.name, profile: { ...user?.profile, phone: profileForm.phone, address: profileForm.address } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span className="breadcrumb-curr">My Account</span></div>

          <div className="resp-grid-2col">

            {/* Sidebar */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              {/* Profile Summary */}
              <div style={{ padding: '20px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem', fontWeight: 900, margin: '0 auto 10px', overflow: 'hidden' }}>
                  {user?.profile?.avatar ? <img src={user.profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A1A' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{user?.email}</div>
                <span className="badge badge-green" style={{ marginTop: '6px' }}>🛍️ Buyer</span>
              </div>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  width: '100%', padding: '13px 18px', border: 'none',
                  background: activeTab === tab ? '#FFF0EE' : '#fff',
                  color: activeTab === tab ? '#E62E04' : '#555',
                  fontWeight: activeTab === tab ? 700 : 400,
                  fontSize: '13px', cursor: 'pointer',
                  borderLeft: `3px solid ${activeTab === tab ? '#E62E04' : 'transparent'}`,
                  transition: 'all 0.15s', textAlign: 'left',
                }}>
                  {tab === 'Orders' ? '📦' : '👤'} {tab}
                  {tab === 'Orders' && orders.length > 0 && <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{orders.length}</span>}
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div>
              {activeTab === 'Orders' && (
                <div>
                  <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '15px' }}>📦 My Orders</div>
                    {orders.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <div className="empty-state-title">No orders yet</div>
                        <div className="empty-state-desc">Start shopping to see your orders here.</div>
                        <Link to="/products" className="btn btn-primary">Browse Products</Link>
                      </div>
                    ) : (
                      orders.map(order => {
                        const stepIdx = STATUS_STEPS.indexOf(order.status);
                        return (
                          <div key={order.id} style={{ padding: '16px 20px', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                              <div>
                                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888', marginBottom: '2px' }}>#{order.id.slice(0,16)}...</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>{formatDate(order.createdAt)}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className={statusClass(order.status)}>{order.status}</span>
                                <span style={{ fontWeight: 800, fontSize: '15px', color: '#E62E04' }}>{formatPKR(order.totalAmount)}</span>
                              </div>
                            </div>

                            {/* Status Progress */}
                            {order.status !== 'cancelled' && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '12px' }}>
                                {STATUS_STEPS.map((step, i) => (
                                  <React.Fragment key={step}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 'none' : 1 }}>
                                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: i <= stepIdx ? '#E62E04' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>
                                        {i < stepIdx ? '✓' : i + 1}
                                      </div>
                                      <span style={{ fontSize: '10px', color: i <= stepIdx ? '#E62E04' : '#bbb', fontWeight: i <= stepIdx ? 700 : 400, marginTop: '3px', whiteSpace: 'nowrap' }}>{step.charAt(0).toUpperCase() + step.slice(1)}</span>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                      <div style={{ flex: 1, height: '2px', background: i < stepIdx ? '#E62E04' : '#e0e0e0', marginBottom: '14px' }} />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}

                            {/* Items */}
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {order.items.map(item => (
                                <span key={item.productId} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginRight: '8px', background: '#f5f5f5', padding: '2px 8px', borderRadius: '4px', marginBottom: '4px' }}>
                                  {item.productName} ×{item.quantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Profile' && (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '15px' }}>👤 Profile Settings</div>
                  <form onSubmit={handleSaveProfile} style={{ padding: '24px', maxWidth: '480px' }}>
                    {saved && <div style={{ background: '#E8F9EE', border: '1px solid #00AE4D', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#00AE4D', fontWeight: 600 }}>✅ Profile saved successfully!</div>}
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" value={user?.email} disabled style={{ background: '#f8f8f8', color: '#888', cursor: 'not-allowed' }} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} placeholder="+92 3XX XXXXXXX" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default Delivery Address</label>
                      <textarea className="form-textarea" value={profileForm.address} onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))} placeholder="Your shipping address" rows={3} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '44px' }}>Save Changes</button>
                  </form>
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
