import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import * as storage from '../../utils/storage';
import { formatPKR, formatDate, statusClass } from '../../utils/helpers';

export default function SellerDashboard() {
  const { user } = useAuth();

  const myProducts = useMemo(() => user ? storage.products.findBySellerId(user.id) : [], [user]);
  const myOrders   = useMemo(() => user ? storage.orders.findBySellerId(user.id) : [], [user]);

  const activeProducts  = myProducts.filter(p => p.status === 'active').length;
  const pendingOrders   = myOrders.filter(o => o.status === 'pending').length;
  const totalRevenue    = myOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const recentOrders    = [...myOrders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5);
  const recentProducts  = [...myProducts].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,4);

  const stats = [
    { label: 'Total Revenue',    value: formatPKR(totalRevenue), icon: '💰', color: '#E62E04', bg: '#FFF0EE', delta: `${myOrders.filter(o=>o.status==='delivered').length} delivered` },
    { label: 'Active Products',  value: activeProducts,          icon: '📦', color: '#2563EB', bg: '#EFF6FF', delta: `${myProducts.length} total` },
    { label: 'Pending Orders',   value: pendingOrders,           icon: '🕐', color: '#FF6A00', bg: '#FFF4EE', delta: `${myOrders.length} total` },
    { label: 'Store Rating',     value: `${(user?.rating || 4.7).toFixed(1)} ★`, icon: '⭐', color: '#FFB800', bg: '#FFFBEB', delta: `${user?.totalOrders || 0} total orders` },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">

          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '2px' }}>
                👋 Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p style={{ fontSize: '13px', color: '#888' }}>{user?.profile?.businessName || 'Your Store'} · Seller Dashboard</p>
            </div>
            <Link to="/seller/products/new" className="btn btn-primary" style={{ height: '40px' }}>+ Add New Product</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {stats.map(s => (
              <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>{s.label}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{s.icon}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>{s.delta}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', alignItems: 'start' }}>

            {/* Recent Orders */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>🧾 Recent Orders</span>
                <Link to="/seller/orders" style={{ fontSize: '12px', color: '#E62E04', fontWeight: 600 }}>View All →</Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px' }}>
                  <div className="empty-state-icon">📭</div>
                  <div className="empty-state-title">No orders yet</div>
                  <div className="empty-state-desc">Orders from buyers will appear here.</div>
                </div>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Order</th><th>Buyer</th><th>Amount</th><th>Date</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(o => (
                        <tr key={o.id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>#{o.id.slice(0,10)}...</td>
                          <td style={{ fontSize: '13px', fontWeight: 600 }}>{o.buyerName || 'Buyer'}</td>
                          <td style={{ fontSize: '13px', fontWeight: 700, color: '#E62E04' }}>{formatPKR(o.totalAmount)}</td>
                          <td style={{ fontSize: '12px', color: '#888' }}>{formatDate(o.createdAt)}</td>
                          <td><span className={statusClass(o.status)}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Actions + Products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Quick Actions */}
              <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '14px' }}>⚡ Quick Actions</div>
                <div style={{ padding: '12px' }}>
                  {[
                    { to: '/seller/products/new', icon: '➕', label: 'Add New Product',   color: '#E62E04' },
                    { to: '/seller/orders',       icon: '📋', label: 'Manage Orders',     color: '#2563EB' },
                    { to: '/seller/products',     icon: '📦', label: 'View All Products', color: '#00AE4D' },
                    { to: '/seller/profile',      icon: '⚙️', label: 'Edit Store Profile',color: '#FF6A00' },
                  ].map(a => (
                    <Link key={a.to} to={a.to} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.15s', marginBottom: '4px' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{a.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{a.label}</span>
                      <span style={{ marginLeft: 'auto', color: '#bbb', fontSize: '14px' }}>›</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Products */}
              <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>📦 My Products</span>
                  <Link to="/seller/products" style={{ fontSize: '12px', color: '#E62E04', fontWeight: 600 }}>Manage →</Link>
                </div>
                <div style={{ padding: '12px' }}>
                  {recentProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>No products yet. <Link to="/seller/products/new" style={{ color: '#E62E04' }}>Add one →</Link></div>
                  ) : (
                    recentProducts.map(p => (
                      <div key={p.id} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f5f5f5', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.2rem' }}>📦</span>}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: '#E62E04', fontWeight: 700 }}>{formatPKR(p.price)}</div>
                        </div>
                        <span className={p.status === 'active' ? 'status-active' : 'status-inactive'}>{p.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
