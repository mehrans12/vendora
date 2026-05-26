import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { formatPKR, CATEGORY_ICONS } from '../../utils/helpers';

export default function ProductsList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState(() => user ? storage.products.findBySellerId(user.id) : []);

  const filtered = useMemo(() => products.filter(p => filter === 'all' ? true : p.status === filter), [products, filter]);

  const handleDelete = (id) => {
    storage.products.delete(id);
    setProducts(storage.products.findBySellerId(user.id));
    setDeleteId(null);
    toast.success('Product deleted');
  };

  const handleToggleStatus = (p) => {
    const newStatus = p.status === 'active' ? 'inactive' : 'active';
    storage.products.update(p.id, { status: newStatus });
    setProducts(storage.products.findBySellerId(user.id));
    toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">
          <div className="breadcrumb"><Link to="/seller/dashboard">Dashboard</Link><span className="breadcrumb-sep">›</span><span className="breadcrumb-curr">My Products</span></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1A1A1A' }}>📦 My Products</h1>
            <Link to="/seller/products/new" className="btn btn-primary" style={{ height: '40px' }}>+ Add Product</Link>
          </div>

          {/* Tabs */}
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #f0f0f0', padding: '0 16px' }}>
              {[['all','All'],['active','Active'],['inactive','Inactive']].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{
                  padding: '12px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: filter === v ? 700 : 400,
                  color: filter === v ? '#E62E04' : '#555',
                  borderBottom: filter === v ? '2px solid #E62E04' : '2px solid transparent',
                  marginBottom: '-1px', transition: 'all 0.15s',
                }}>
                  {l}
                  <span style={{ marginLeft: '6px', fontSize: '11px', background: filter === v ? '#FFF0EE' : '#f0f0f0', color: filter === v ? '#E62E04' : '#888', padding: '1px 6px', borderRadius: '99px', fontWeight: 700 }}>
                    {v === 'all' ? products.length : products.filter(p => p.status === v).length}
                  </span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px' }}>
                <div className="empty-state-icon">📦</div>
                <div className="empty-state-title">No products {filter !== 'all' ? `with "${filter}" status` : 'yet'}</div>
                <div className="empty-state-desc">Start listing products to grow your store.</div>
                <Link to="/seller/products/new" className="btn btn-primary">Add First Product</Link>
              </div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', background: '#f8f8f8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e8e8e8' }}>
                              {p.image ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.4rem' }}>{CATEGORY_ICONS[p.category] || '📦'}</span>}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '13px', color: '#1A1A1A', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <span style={{ color: '#FFB800' }}>{'★'.repeat(Math.round(p.rating || 0))}</span>
                                <span>{p.rating?.toFixed(1) || '0.0'} · {p.reviews || 0} sold</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-muted">{CATEGORY_ICONS[p.category]} {p.category}</span></td>
                        <td style={{ fontWeight: 700, color: '#E62E04', fontSize: '13px' }}>{formatPKR(p.price)}</td>
                        <td>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: p.stock === 0 ? '#E62E04' : p.stock <= 5 ? '#FF6A00' : '#1A1A1A' }}>
                            {p.stock === 0 ? '⚠️ Out' : p.stock <= 5 ? `⚡ ${p.stock} left` : p.stock}
                          </span>
                        </td>
                        <td>
                          <div className="toggle-wrapper" onClick={() => handleToggleStatus(p)}>
                            <div className={`toggle ${p.status === 'active' ? 'on' : ''}`} style={{ width: '36px', height: '20px' }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: p.status === 'active' ? '#00AE4D' : '#888' }}>
                              {p.status === 'active' ? 'Live' : 'Off'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <Link to={`/products/${p.id}`} target="_blank" className="btn btn-ghost btn-sm" title="Preview">👁️</Link>
                            <Link to={`/seller/products/${p.id}/edit`} className="btn btn-ghost btn-sm">✏️ Edit</Link>
                            <button onClick={() => setDeleteId(p.id)} className="btn btn-sm" style={{ background: '#FFF0EE', border: '1px solid #FFD0C8', color: '#E62E04' }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
            <div className="modal-title" style={{ textAlign: 'center' }}>Delete Product?</div>
            <div className="modal-desc" style={{ textAlign: 'center' }}>This action cannot be undone. The product will be permanently removed.</div>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
