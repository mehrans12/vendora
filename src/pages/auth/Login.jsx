import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = login(email.trim(), password);
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}! 🎉`);
      if (user.role === 'admin')  navigate('/admin');
      else if (user.role === 'seller') navigate('/seller/dashboard');
      else navigate(searchParams.get('redirect') || '/');
    } catch (err) {
      toast.error(err.message);
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const creds = { buyer: ['buyer@vendora.pk','buyer123'], seller: ['seller@vendora.pk','seller123'], admin: ['admin@vendora.pk','admin123'] };
    setEmail(creds[role][0]); setPassword(creds[role][1]); setErrors({});
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F5F5F5' }}>

      {/* Left Panel — Brand */}
      <div className="hide-mobile" style={{ width: '440px', flexShrink: 0, background: 'linear-gradient(160deg, #E62E04 0%, #FF6A00 60%, #FFB800 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(0,0,0,0.08)' }} />
        <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 900, margin: '0 auto 24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>V</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.03em' }}>VENDORA</h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.7, maxWidth: '280px', margin: '0 auto' }}>Pakistan's modern marketplace. Sell smart, buy smarter.</p>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[['🛍️','Thousands of Products'],['🔒','Secure Transactions'],['🚚','Fast Delivery'],['⭐','Trusted Sellers']].map(([icon,text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 16px', backdropFilter: 'blur(6px)' }}>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', animation: 'slideUp 0.3s ease' }}>

          {/* Mobile Logo */}
          <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg,#E62E04,#FF6A00)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.8rem', fontWeight: 900, margin: '0 auto 12px' }}>V</div>
            <h2 style={{ fontWeight: 900, color: '#E62E04', fontSize: '1.5rem' }}>VENDORA</h2>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '36px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1A1A1A', marginBottom: '6px' }}>Sign In</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Welcome back! Please enter your details.</p>

            {/* Demo Quick Fill */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
              {[['buyer','🛍️ Buyer'],['seller','🏪 Seller'],['admin','🔐 Admin']].map(([role, label]) => (
                <button key={role} onClick={() => fillDemo(role)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: '1px solid #e0e0e0', background: '#fafafa', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#555', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#E62E04'; e.currentTarget.style.color = '#E62E04'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#555'; }}>
                  {label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', marginBottom: '20px', marginTop: '-14px' }}>Quick demo fill ↑</p>

            {errors.form && (
              <div style={{ background: '#FFF0EE', border: '1px solid #FFD0C8', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#E62E04' }}>
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="your@email.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p,email:null})); }} />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({...p,password:null})); }} style={{ paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '16px' }}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ height: '46px', fontSize: '15px', marginTop: '4px' }}>
                {loading ? <><span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%' }} /> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#888' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#E62E04', fontWeight: 700 }}>Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
