import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { formatPKR, formatDate, statusClass, getInitials } from '../../utils/helpers';

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: '📊' },
  { key: 'users',     label: 'Users',     icon: '👥' },
  { key: 'products',  label: 'Products',  icon: '📦' },
  { key: 'orders',    label: 'Orders',    icon: '🧾' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const allUsers    = useMemo(() => storage.users.getAll(), [activeTab]);
  const allProducts = useMemo(() => storage.products.getAll(), [activeTab]);
  const allOrders   = useMemo(() => storage.orders.getAll(), [activeTab]);

  const sellers = allUsers.filter(u => u.role === 'seller');
  const buyers  = allUsers.filter(u => u.role === 'buyer');
  const activeP = allProducts.filter(p => p.status === 'active');
  const revenue  = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingO = allOrders.filter(o => o.status === 'pending');

  const handleLogout = () => { logout(); navigate('/'); };

  const handleDeleteProduct = (id) => {
    storage.products.delete(id);
    setDeleteConfirm(null);
    toast.success('Product deleted');
  };

  const filteredUsers    = allUsers.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  const filteredProducts = allProducts.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredOrders   = allOrders.filter(o => o.id?.includes(search) || o.buyerName?.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: 'Total Revenue',   value: formatPKR(revenue),           icon: '💰', color: '#E62E04', bg: '#FFF0EE' },
    { label: 'Total Orders',    value: allOrders.length,              icon: '🧾', color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Active Products', value: activeP.length,                icon: '📦', color: '#00AE4D', bg: '#E8F9EE' },
    { label: 'Total Sellers',   value: sellers.length,                icon: '🏪', color: '#FF6A00', bg: '#FFF4EE' },
    { label: 'Total Buyers',    value: buyers.length,                 icon: '🛍️', color: '#7C3AED', bg: '#EDE9FE' },
    { label: 'Pending Orders',  value: pendingO.length,               icon: '⏳', color: '#FFB800', bg: '#FFFBEB' },
  ];

  return (
    <div className="admin-layout">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0 }}>V</div>
          <div>
            <div style={{ fontWeight: 900, color: '#fff', fontSize: '14px', lineHeight: 1 }}>VENDORA</div>
            <div style={{ fontSize: '10px', color: '#E62E04', fontWeight: 700, letterSpacing: '0.04em' }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`} style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left', background: 'none' }}>
              <span className="admin-nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* User info at bottom */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: '10px', color: '#E62E04', fontWeight: 600 }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#999', fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,46,4,0.2)'; e.currentTarget.style.color = '#FF4747'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#999'; }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="admin-content">

        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#1A1A1A' }}>{TABS.find(t => t.key === activeTab)?.icon} {TABS.find(t => t.key === activeTab)?.label}</span>
            <div style={{ fontSize: '11px', color: '#888' }}>VENDORA Admin Panel</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {['products','users','orders'].includes(activeTab) && (
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ padding: '7px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', width: '220px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#E62E04'}
                onBlur={e => e.target.style.borderColor = '#e0e0e0'}
              />
            )}
            <Link to="/" style={{ fontSize: '12px', color: '#888', fontWeight: 600 }}>← Storefront</Link>
          </div>
        </div>

        <div className="admin-main">

          {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {stats.map(s => (
                  <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>{s.label}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Recent Orders */}
                <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                    🧾 Recent Orders
                    <button onClick={() => setActiveTab('orders')} style={{ fontSize: '12px', color: '#E62E04', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                  </div>
                  {allOrders.slice(0,5).map(o => (
                    <div key={o.id} style={{ padding: '10px 18px', borderBottom: '1px solid #f8f8f8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600 }}>{o.buyerName || 'Buyer'}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{formatDate(o.createdAt)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#E62E04' }}>{formatPKR(o.totalAmount)}</span>
                        <span className={statusClass(o.status)}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                  {allOrders.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '13px' }}>No orders yet</div>}
                </div>

                {/* Top Sellers */}
                <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                    🏪 Sellers
                    <button onClick={() => setActiveTab('users')} style={{ fontSize: '12px', color: '#E62E04', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                  </div>
                  {sellers.slice(0,5).map(s => (
                    <div key={s.id} style={{ padding: '10px 18px', borderBottom: '1px solid #f8f8f8', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                        {s.profile?.avatar ? <img src={s.profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(s.name)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.profile?.businessName || s.name}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{allProducts.filter(p => p.sellerId === s.id).length} products</div>
                      </div>
                      <span className="badge badge-green">Seller</span>
                    </div>
                  ))}
                  {sellers.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: '13px' }}>No sellers yet</div>}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS TAB ───────────────────────────────────────────────────── */}
          {activeTab === 'users' && (
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>All Users ({allUsers.length})</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-green">{buyers.length} buyers</span>
                  <span className="badge badge-blue">{sellers.length} sellers</span>
                </div>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Stats</th></tr></thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.role === 'seller' ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : u.role === 'admin' ? 'linear-gradient(135deg,#E62E04,#FF6A00)' : 'linear-gradient(135deg,#00AE4D,#0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                              {u.profile?.avatar ? <img src={u.profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(u.name)}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600 }}>{u.name}</div>
                          </div>
                        </td>
                        <td style={{ fontSize: '12px', color: '#888' }}>{u.email}</td>
                        <td>
                          <span className={u.role === 'admin' ? 'badge badge-red' : u.role === 'seller' ? 'badge badge-blue' : 'badge badge-green'}>
                            {u.role === 'admin' ? '🔐 Admin' : u.role === 'seller' ? '🏪 Seller' : '🛍️ Buyer'}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px', color: '#888' }}>{formatDate(u.createdAt)}</td>
                        <td style={{ fontSize: '12px', color: '#888' }}>
                          {u.role === 'seller' ? `${allProducts.filter(p => p.sellerId === u.id).length} products` : `${allOrders.filter(o => o.buyerId === u.id).length} orders`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS TAB ────────────────────────────────────────────────── */}
          {activeTab === 'products' && (
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>All Products ({allProducts.length})</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-green">{activeP.length} active</span>
                  <span className="badge badge-muted">{allProducts.filter(p => p.status === 'inactive').length} inactive</span>
                </div>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead><tr><th>Product</th><th>Seller</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: '#f8f8f8', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8e8e8' }}>
                              {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>📦</span>}
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                          </div>
                        </td>
                        <td style={{ fontSize: '12px', color: '#888' }}>{p.sellerName || '—'}</td>
                        <td><span className="badge badge-muted">{p.category}</span></td>
                        <td style={{ fontWeight: 700, color: '#E62E04', fontSize: '13px' }}>{formatPKR(p.price)}</td>
                        <td style={{ fontSize: '13px', color: p.stock === 0 ? '#E62E04' : '#1A1A1A' }}>{p.stock}</td>
                        <td><span className={p.status === 'active' ? 'status-active' : 'status-inactive'}>{p.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <Link to={`/products/${p.id}`} target="_blank" className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>👁️ View</Link>
                            <button onClick={() => setDeleteConfirm(p.id)} className="btn btn-sm" style={{ background: '#FFF0EE', border: '1px solid #FFD0C8', color: '#E62E04', fontSize: '11px' }}>🗑️ Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORDERS TAB ──────────────────────────────────────────────────── */}
          {activeTab === 'orders' && (
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>All Orders ({allOrders.length})</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-orange">{pendingO.length} pending</span>
                  <span className="badge badge-green">{allOrders.filter(o => o.status === 'delivered').length} delivered</span>
                </div>
              </div>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead><tr><th>Order ID</th><th>Buyer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {filteredOrders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => (
                      <tr key={o.id}>
                        <td style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>#{o.id.slice(0,14)}...</td>
                        <td style={{ fontSize: '13px', fontWeight: 600 }}>{o.buyerName || 'Buyer'}</td>
                        <td style={{ fontSize: '12px', color: '#888' }}>{o.items.length} items</td>
                        <td style={{ fontWeight: 700, color: '#E62E04', fontSize: '13px' }}>{formatPKR(o.totalAmount)}</td>
                        <td style={{ fontSize: '12px', color: '#888' }}>{formatDate(o.createdAt)}</td>
                        <td><span className={statusClass(o.status)}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '13px' }}>No orders found</div>}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
            <div className="modal-title" style={{ textAlign: 'center' }}>Delete Product?</div>
            <div className="modal-desc" style={{ textAlign: 'center' }}>This will permanently remove the product from the platform.</div>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={() => handleDeleteProduct(deleteConfirm)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
