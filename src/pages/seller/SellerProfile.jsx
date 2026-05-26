import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { imageToBase64, getInitials } from '../../utils/helpers';

export default function SellerProfile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    businessName: user?.profile?.businessName || '',
    businessDescription: user?.profile?.businessDescription || '',
    phone: user?.profile?.phone || '',
    address: user?.profile?.address || '',
    avatar: user?.profile?.avatar || null,
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.profile?.avatar || null);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleAvatar = async (file) => {
    if (!file) return;
    try {
      const b64 = await imageToBase64(file);
      setAvatarPreview(b64);
      set('avatar', b64);
    } catch (err) { toast.error(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfile({
        name: form.name,
        profile: {
          ...user?.profile,
          businessName: form.businessName,
          businessDescription: form.businessDescription,
          phone: form.phone,
          address: form.address,
          avatar: form.avatar,
        },
      });
      toast.success('Store profile saved! ✅');
    } catch { toast.error('Failed to save profile'); }
    finally { setSaving(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/seller/dashboard">Dashboard</Link><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-curr">Store Profile</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Avatar Card */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #E62E04', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: 900 }}>
                  {avatarPreview ? <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitials(form.name || user?.name)}
                </div>
                <label htmlFor="avatar-input" style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', background: '#E62E04', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #fff', fontSize: '12px' }}>
                  📷
                </label>
                <input id="avatar-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleAvatar(e.target.files[0])} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A1A1A' }}>{form.businessName || form.name || 'Your Store'}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{user?.email}</div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-green">✓ Verified Seller</span>
                  <span className="badge badge-yellow">⭐ {(user?.rating || 4.7).toFixed(1)} Rating</span>
                  <span className="badge badge-blue">📦 {user?.totalOrders || 0} Orders</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '14px', background: '#fafafa' }}>⚙️ Store Information</div>
              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Business / Store Name</label>
                    <input className="form-input" value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="e.g. Ali's Crafts Store" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Store Description</label>
                  <textarea className="form-textarea" value={form.businessDescription} onChange={e => set('businessDescription', e.target.value)} placeholder="Tell buyers about your store, what you sell, and your story..." rows={4} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 3XX XXXXXXX" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" value={user?.email} disabled style={{ background: '#f8f8f8', color: '#888', cursor: 'not-allowed' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Business Address / Location</label>
                  <input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="City, Province, Pakistan" />
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={saving} className="btn btn-primary" style={{ height: '44px', minWidth: '140px' }}>
                    {saving ? '⏳ Saving...' : '✅ Save Profile'}
                  </button>
                  <Link to="/seller/dashboard" className="btn btn-ghost" style={{ height: '44px' }}>Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
