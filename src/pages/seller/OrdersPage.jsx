import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { formatPKR, formatDateTime, statusClass, ORDER_STATUSES } from '../../utils/helpers';

const FILTERS = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState(() => user ? storage.orders.findBySellerId(user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
  const [expandedId, setExpandedId] = useState(null);

  const filtered = useMemo(() => filter === 'all' ? orders : orders.filter(o => o.status === filter), [orders, filter]);

  const handleUpdateStatus = (id, status) => {
    storage.orders.updateStatus(id, status);
    setOrders(storage.orders.findBySellerId(user.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    toast.success(`Order status updated to "${status}"`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">
          <div className="breadcrumb"><Link to="/seller/dashboard">Dashboard</Link><span className="breadcrumb-sep">›</span><span className="breadcrumb-curr">Orders</span></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A1A' }}>🧾 Orders</h1>
            <div className="badge badge-red">{orders.filter(o => o.status === 'pending').length} pending</div>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #f0f0f0', overflowX: 'auto', padding: '0 16px' }}>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: filter === f ? 700 : 400,
                  color: filter === f ? '#E62E04' : '#555',
                  borderBottom: filter === f ? '2px solid #E62E04' : '2px solid transparent',
                  marginBottom: '-1px', whiteSpace: 'nowrap', transition: 'all 0.15s', textTransform: 'capitalize',
                }}>
                  {f === 'all' ? 'All Orders' : f.charAt(0).toUpperCase() + f.slice(1)}
                  {' '}
                  <span style={{ fontSize: '10px', background: filter === f ? '#FFF0EE' : '#f0f0f0', color: filter === f ? '#E62E04' : '#888', padding: '1px 5px', borderRadius: '99px', fontWeight: 700 }}>
                    {f === 'all' ? orders.length : orders.filter(o => o.status === f).length}
                  </span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px' }}>
                <div className="empty-state-icon">📭</div>
                <div className="empty-state-title">No {filter === 'all' ? '' : filter} orders</div>
                <div className="empty-state-desc">Orders from buyers will appear here.</div>
              </div>
            ) : (
              <div>
                {filtered.map(order => (
                  <div key={order.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    {/* Order Row */}
                    <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', cursor: 'pointer', background: expandedId === order.id ? '#fafafa' : '#fff', transition: 'background 0.15s' }}
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888', marginBottom: '2px' }}>#{order.id.slice(0,20)}...</div>
                        <div style={{ fontSize: '12px', color: '#1A1A1A', fontWeight: 600 }}>{order.buyerName || 'Buyer'}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{formatDateTime(order.createdAt)}</div>
                      </div>
                      <div style={{ fontSize: '13px', color: '#555' }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: '#E62E04' }}>{formatPKR(order.totalAmount)}</div>
                      <span className={statusClass(order.status)}>{order.status}</span>

                      {/* Status Updater */}
                      <select
                        value={order.status}
                        onChange={e => { e.stopPropagation(); handleUpdateStatus(order.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #e0e0e0', fontSize: '12px', color: '#555', cursor: 'pointer', background: '#fff' }}
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>

                      <span style={{ color: '#bbb', fontSize: '16px', transition: 'transform 0.2s', transform: expandedId === order.id ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === order.id && (
                      <div style={{ padding: '16px 20px', background: '#FAFAFA', borderTop: '1px solid #f0f0f0', animation: 'fadeIn 0.2s ease' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>Shipping Address</div>
                            <div style={{ fontSize: '13px', color: '#1A1A1A' }}>{order.shippingAddress || '—'}</div>
                            {order.buyerPhone && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>📞 {order.buyerPhone}</div>}
                          </div>
                          {order.notes && (
                            <div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>Order Notes</div>
                              <div style={{ fontSize: '13px', color: '#555', fontStyle: 'italic' }}>"{order.notes}"</div>
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Order Items</div>
                        {order.items.map(item => (
                          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#fff', borderRadius: '4px', border: '1px solid #f0f0f0', marginBottom: '4px', fontSize: '13px' }}>
                            <span style={{ fontWeight: 600 }}>{item.productName}</span>
                            <span style={{ color: '#888' }}>×{item.quantity}</span>
                            <span style={{ fontWeight: 700, color: '#E62E04' }}>{formatPKR(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
