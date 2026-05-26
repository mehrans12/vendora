import React, { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import * as storage from '../../utils/storage';
import { CATEGORIES, imageToBase64 } from '../../utils/helpers';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const existing = useMemo(() => id ? storage.products.findById(id) : null, [id]);

  const [form, setForm] = useState({
    name: '', description: '', category: CATEGORIES[0],
    price: '', stock: '', image: null, status: 'active',
    ...(existing ? { ...existing } : {}),
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [charCount, setCharCount] = useState(existing?.description?.length || 0);
  const [imagePreview, setImagePreview] = useState(existing?.image || null);
  const [dragging, setDragging] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null })); };

  const handleImage = async (file) => {
    if (!file) return;
    try {
      const b64 = await imageToBase64(file);
      setImagePreview(b64);
      set('image', b64);
    } catch (err) { toast.error(err.message); }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be greater than 0';
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Stock quantity is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const data = { ...form, price: Number(form.price), stock: Number(form.stock), sellerId: user.id, sellerName: user.profile?.businessName || user.name };
      if (isEdit) { storage.products.update(id, data); toast.success('Product updated! ✅'); }
      else { storage.products.create(data); toast.success('Product added! 🎉'); }
      navigate('/seller/products');
    } catch { toast.error('Something went wrong'); }
    finally { setSaving(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/seller/dashboard">Dashboard</Link><span className="breadcrumb-sep">›</span>
            <Link to="/seller/products">Products</Link><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-curr">{isEdit ? 'Edit Product' : 'Add New Product'}</span>
          </div>

          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1A1A1A' }}>{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h1>
                <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Fill in the details below to {isEdit ? 'update your' : 'list a new'} product.</p>
              </div>
              <Link to="/seller/products" className="btn btn-ghost btn-sm">← Cancel</Link>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

                {/* Left — Details */}
                <div>
                  <div className="form-group">
                    <label className="form-label">Product Name <span style={{ color: '#E62E04' }}>*</span></label>
                    <input className={`form-input ${errors.name ? 'error' : ''}`} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Enter a clear, descriptive product name" />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Description
                      <span style={{ fontWeight: 400, color: charCount > 480 ? '#E62E04' : '#888', marginLeft: '8px' }}>({charCount}/500)</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      value={form.description}
                      onChange={e => { set('description', e.target.value); setCharCount(e.target.value.length); }}
                      maxLength={500}
                      placeholder="Describe your product — materials, size, features, benefits..."
                      rows={5}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category <span style={{ color: '#E62E04' }}>*</span></label>
                      <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <div className="toggle-wrapper" style={{ marginTop: '10px' }} onClick={() => set('status', form.status === 'active' ? 'inactive' : 'active')}>
                        <div className={`toggle ${form.status === 'active' ? 'on' : ''}`} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: form.status === 'active' ? '#00AE4D' : '#888' }}>
                          {form.status === 'active' ? '✓ Active (Visible)' : '✗ Inactive (Hidden)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price (PKR) <span style={{ color: '#E62E04' }}>*</span></label>
                      <input type="number" className={`form-input ${errors.price ? 'error' : ''}`} value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" min="0" step="1" />
                      {errors.price && <div className="form-error">{errors.price}</div>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock Quantity <span style={{ color: '#E62E04' }}>*</span></label>
                      <input type="number" className={`form-input ${errors.stock ? 'error' : ''}`} value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" min="0" />
                      {errors.stock && <div className="form-error">{errors.stock}</div>}
                    </div>
                  </div>
                </div>

                {/* Right — Image */}
                <div>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Product Image</label>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleImage(e.dataTransfer.files[0]); }}
                    style={{
                      border: `2px dashed ${dragging ? '#E62E04' : '#d0d0d0'}`,
                      borderRadius: '8px',
                      background: dragging ? '#FFF0EE' : '#fafafa',
                      transition: 'all 0.15s',
                      overflow: 'hidden',
                      aspectRatio: '1/1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', position: 'relative',
                    }}
                    onClick={() => document.getElementById('img-upload').click()}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                          <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>🔄 Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📷</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '4px' }}>Click or drag to upload</div>
                        <div style={{ fontSize: '11px', color: '#aaa' }}>JPG, PNG, WEBP · Max 5MB</div>
                      </div>
                    )}
                    <input id="img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImage(e.target.files[0])} />
                  </div>
                  {imagePreview && (
                    <button type="button" onClick={() => { setImagePreview(null); set('image', null); }} style={{ width: '100%', marginTop: '8px', padding: '7px', fontSize: '12px', color: '#E62E04', background: '#FFF0EE', border: '1px solid #FFD0C8', borderRadius: '4px', cursor: 'pointer' }}>
                      🗑️ Remove Image
                    </button>
                  )}
                  <div style={{ marginTop: '16px', padding: '12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0', fontSize: '11px', color: '#888', lineHeight: 1.7 }}>
                    💡 <strong>Tips:</strong> Use square images for best display. Show your product from multiple angles if possible.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ height: '46px', minWidth: '160px', fontSize: '15px' }}>
                  {saving ? '⏳ Saving...' : isEdit ? '✅ Update Product' : '🚀 List Product'}
                </button>
                <Link to="/seller/products" className="btn btn-ghost" style={{ height: '46px' }}>Cancel</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
