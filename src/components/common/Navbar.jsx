import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { getInitials, CATEGORIES } from '../../utils/helpers';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery]  = useState('');
  const [searchCat, setSearchCat]      = useState('All');
  const dropdownRef = useRef(null);

  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams({ search: searchQuery.trim() });
      if (searchCat !== 'All') params.set('category', searchCat);
      navigate(`/products?${params.toString()}`);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isSeller = user?.role === 'seller';
  const isBuyer = !user || user?.role === 'buyer';

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>

      {/* ── TOP BAR ───────────────────────────────────────────────────────── */}
      <div style={{ background: '#222', borderBottom: '1px solid #333' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '34px', fontSize: '12px' }}>
          <div style={{ color: '#aaa', display: 'flex', gap: '16px' }}>
            <span>🇵🇰 Pakistan</span>
            <span style={{ color: '#555' }}>|</span>
            <span>🌐 English</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {!user ? (
              <>
                <Link to="/login" style={{ color: '#ccc', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ccc'}>Sign in</Link>
                <Link to="/signup" style={{ color: '#ccc', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ccc'}>Join Free</Link>
              </>
            ) : (
              <span style={{ color: '#ccc' }}>Hi, <strong style={{ color: '#fff' }}>{user.name?.split(' ')[0]}</strong></span>
            )}
            <span style={{ color: '#555' }}>|</span>
            {!isSeller && !isAdmin && (
              <Link to="/signup?role=seller" style={{ color: '#FFB800', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#FFB800'}>
                Sell on VENDORA
              </Link>
            )}
            {isSeller && (
              <Link to="/seller/dashboard" style={{ color: '#FFB800', fontWeight: 600, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#FFB800'}>
                Seller Center
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" style={{ color: '#FF4747', fontWeight: 600 }}>Admin Panel</Link>
            )}
            <span style={{ color: '#555' }}>|</span>
            <span style={{ color: '#ccc', cursor: 'pointer' }}>Help</span>
          </div>
        </div>
      </div>

      {/* ── MAIN BAR ──────────────────────────────────────────────────────── */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '24px', height: '72px' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #E62E04, #FF6A00)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: '1.3rem',
            boxShadow: '0 3px 10px rgba(230,46,4,0.35)',
          }}>V</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#E62E04', letterSpacing: '-0.03em', lineHeight: 1 }}>VENDORA</div>
            <div style={{ fontSize: '9px', color: '#888', letterSpacing: '0.08em', fontWeight: 600 }}>MARKETPLACE</div>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="ali-search hide-mobile" style={{ flex: 1, maxWidth: '680px' }}>
          <select
            className="ali-search-cat"
            value={searchCat}
            onChange={e => setSearchCat(e.target.value)}
            style={{ height: '46px' }}
          >
            <option>All</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="text"
            className="ali-search-input"
            placeholder="Search products, brands and more..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ height: '46px' }}
          />
          <button type="submit" className="ali-search-btn" style={{ height: '46px' }}>
            🔍 Search
          </button>
        </form>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 }}>

          {/* Cart */}
          {(isBuyer) && (
            <Link to="/cart" style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '52px', height: '52px',
              borderRadius: '6px',
              color: '#444',
              textDecoration: 'none',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF0EE'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#555', marginTop: '1px' }}>Cart</span>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '4px',
                  background: '#E62E04', color: '#fff',
                  fontSize: '10px', fontWeight: 700,
                  minWidth: '18px', height: '18px',
                  borderRadius: '9px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 3px',
                  border: '1.5px solid #fff',
                }}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
          )}

          {/* Account Dropdown */}
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                  padding: '6px 10px',
                  borderRadius: '6px', border: '1px solid #eee',
                  background: dropdownOpen ? '#FFF0EE' : '#fff',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#FFF0EE'}
                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: isAdmin
                    ? 'linear-gradient(135deg, #E62E04, #FF6A00)'
                    : isSeller
                    ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
                    : 'linear-gradient(135deg, #E62E04, #FF6A00)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '12px', fontWeight: 700,
                  overflow: 'hidden',
                }}>
                  {user.profile?.avatar
                    ? <img src={user.profile.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : getInitials(user.name)}
                </div>
                <span style={{ fontSize: '10px', color: '#555', fontWeight: 600, maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                  background: '#fff', border: '1px solid #eee',
                  borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  padding: '6px', minWidth: '200px',
                  zIndex: 50, animation: 'fadeIn 0.15s ease',
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A1A' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: '#888' }}>{user.email}</div>
                    <span style={{
                      display: 'inline-block', marginTop: '4px',
                      padding: '2px 8px', borderRadius: '99px',
                      fontSize: '10px', fontWeight: 700,
                      background: isAdmin ? '#FFF0EE' : isSeller ? '#EFF6FF' : '#F0FFF4',
                      color: isAdmin ? '#E62E04' : isSeller ? '#2563EB' : '#00AE4D',
                    }}>
                      {isAdmin ? '🔐 Admin' : isSeller ? '🏪 Seller' : '🛍️ Buyer'}
                    </span>
                  </div>

                  {isAdmin && (
                    <DropdownItem to="/admin" label="Admin Dashboard" icon="🔐" />
                  )}
                  {isSeller && (
                    <>
                      <DropdownItem to="/seller/dashboard" label="Seller Dashboard" icon="📊" />
                      <DropdownItem to="/seller/products" label="My Products" icon="📦" />
                      <DropdownItem to="/seller/orders" label="Orders" icon="🧾" />
                      <DropdownItem to="/seller/profile" label="Store Profile" icon="⚙️" />
                    </>
                  )}
                  {!isAdmin && !isSeller && (
                    <>
                      <DropdownItem to="/dashboard" label="My Orders" icon="📦" />
                      <DropdownItem to="/cart" label="Shopping Cart" icon="🛒" />
                      <DropdownItem to="/dashboard?tab=profile" label="Profile" icon="👤" />
                    </>
                  )}

                  <div style={{ borderTop: '1px solid #f0f0f0', marginTop: '4px', paddingTop: '4px' }}>
                    <button onClick={handleLogout} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      width: '100%', padding: '9px 12px',
                      borderRadius: '6px', border: 'none', background: 'none',
                      color: '#E62E04', fontSize: '13px', fontWeight: 500,
                      cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF0EE'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{ padding: '0 20px', height: '40px', flexShrink: 0 }}>
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="hide-desktop"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: '44px', height: '44px', borderRadius: '6px', border: '1px solid #e0e0e0', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }}
          >
            <span style={{ display: 'block', width: '18px', height: '2px', background: '#444', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ display: 'block', width: '18px', height: '2px', background: '#444', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '18px', height: '2px', background: '#444', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* ── CATEGORY NAV BAR ──────────────────────────────────────────────── */}
      <div className="hide-mobile" style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '42px', overflowX: 'auto' }}>
          <Link to="/products" style={{ ...catNavStyle, color: '#E62E04', fontWeight: 700 }}>All Products</Link>
          {CATEGORIES.map(cat => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} style={catNavStyle}
              onMouseEnter={e => { e.currentTarget.style.color = '#E62E04'; e.currentTarget.style.borderBottom = '2px solid #E62E04'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#333'; e.currentTarget.style.borderBottom = '2px solid transparent'; }}>
              {cat}
            </Link>
          ))}
          {!isSeller && !isAdmin && (
            <Link to="/signup?role=seller" style={{ ...catNavStyle, color: '#FF6A00', fontWeight: 700, marginLeft: 'auto' }}>
              🏪 Become a Seller
            </Link>
          )}
        </div>
      </div>

      {/* ── MOBILE SEARCH + MENU ──────────────────────────────────────────── */}
      <div className="hide-desktop" style={{ borderTop: '1px solid #f0f0f0', padding: '8px 12px' }}>
        <form onSubmit={handleSearch} className="ali-search">
          <input
            type="text"
            className="ali-search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ height: '38px' }}
          />
          <button type="submit" className="ali-search-btn" style={{ height: '38px', padding: '0 14px' }}>🔍</button>
        </form>
      </div>

      {menuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px', animation: 'fadeIn 0.2s ease' }}>
          <MobileNavLink to="/products">Browse Products</MobileNavLink>
          {isSeller && <MobileNavLink to="/seller/dashboard">Seller Dashboard</MobileNavLink>}
          {isAdmin && <MobileNavLink to="/admin">Admin Panel</MobileNavLink>}
          {!user && <MobileNavLink to="/signup?role=seller">Become a Seller</MobileNavLink>}
          {!user && <MobileNavLink to="/login">Sign In</MobileNavLink>}
          {user && (
            <button onClick={handleLogout} style={{ padding: '12px', borderRadius: '6px', border: 'none', background: '#FFF0EE', color: '#E62E04', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}>
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};

const catNavStyle = {
  padding: '0 12px', height: '42px', display: 'flex', alignItems: 'center',
  fontSize: '13px', fontWeight: 500, color: '#333', whiteSpace: 'nowrap',
  borderBottom: '2px solid transparent', transition: 'all 0.15s',
  textDecoration: 'none', flexShrink: 0,
};

const DropdownItem = ({ to, label, icon }) => (
  <Link to={to} style={{
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '9px 12px', borderRadius: '6px',
    fontSize: '13px', fontWeight: 500, color: '#333',
    textDecoration: 'none', transition: 'background 0.15s',
  }}
  onMouseEnter={e => e.currentTarget.style.background = '#f8f8f8'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    {icon} {label}
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <Link to={to} style={{
    display: 'block', padding: '12px', borderRadius: '6px',
    color: '#333', fontWeight: 500, textDecoration: 'none', transition: 'background 0.15s',
  }}
  onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    {children}
  </Link>
);
