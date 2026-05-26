import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function Signup() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '', role: 'buyer' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const { signup } = useAuth();
  const { toast }  = useToast();
  const navigate   = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'seller') setForm(p => ({ ...p, role: 'seller' }));
  }, [searchParams]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: null, form: null })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Full name required (min 2 chars)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = signup(form.email.trim(), form.password, form.name.trim(), form.role);
      toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F5F5' }}>

      {/* Left Brand Panel */}
      <div className="hide-mobile" style={{ width: '400px', flexShrink: 0, background: 'linear-gradient(160deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(230,46,4,0.15)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,106,0,0.12)' }} />
        <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, margin: '0 auto 24px' }}>V</div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.03em' }}>Join VENDORA</h1>
          <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: 1.8, maxWidth: '260px', margin: '0 auto' }}>Pakistan's growing marketplace. Create your free account today.</p>
          <div style={{ marginTop: '36px', background: 'rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Join Our Community</div>
            {[['500+','Sellers'],['10K+','Products'],['50K+','Buyers']].map(([v,l]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{l}</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#FF6A00' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '440px', animation: 'slideUp 0.3s ease' }}>

          {/* Mobile Logo */}
          <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.6rem', fontWeight: 900, margin: '0 auto 12px' }}>V</div>
            <h2 style={{ fontWeight: 900, color: '#E62E04', fontSize: '1.4rem' }}>Create Account</h2>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '6px' }}>Create Your Account</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Free forever. No credit card required.</p>

            {/* Role Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              {[['buyer','🛍️ I\'m a Buyer'],['seller','🏪 I\'m a Seller']].map(([role,label]) => (
                <button key={role} type="button" onClick={() => set('role', role)} style={{
                  padding: '12px', borderRadius: '8px', border: `2px solid ${form.role === role ? '#E62E04' : '#e0e0e0'}`,
                  background: form.role === role ? '#FFF0EE' : '#fafafa',
                  color: form.role === role ? '#E62E04' : '#666',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {errors.form && (
              <div style={{ background: '#FFF0EE', border: '1px solid #FFD0C8', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#E62E04' }}>
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Full Name <span style={{ color: '#E62E04' }}>*</span></label>
                <input type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address <span style={{ color: '#E62E04' }}>*</span></label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Password <span style={{ color: '#E62E04' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '16px' }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password <span style={{ color: '#E62E04' }}>*</span></label>
                <input type={showPw ? 'text' : 'password'} className={`form-input ${errors.confirm ? 'error' : ''}`} placeholder="Re-enter password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
                {errors.confirm && <div className="form-error">{errors.confirm}</div>}
              </div>

              <p style={{ fontSize: '11px', color: '#bbb', marginBottom: '16px' }}>
                By creating an account, you agree to our <span style={{ color: '#E62E04', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: '#E62E04', cursor: 'pointer' }}>Privacy Policy</span>.
              </p>

              <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ height: '46px', fontSize: '15px' }}>
                {loading ? 'Creating Account...' : `Create ${form.role === 'seller' ? 'Seller' : 'Buyer'} Account`}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#888' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#E62E04', fontWeight: 700 }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
