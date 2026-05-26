import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer style={{ background: '#1A1A1A', color: '#999', marginTop: 'auto' }}>

    {/* ── Trust Strip ──────────────────────────────────────────────────────── */}
    <div style={{ background: '#222', borderBottom: '1px solid #2E2E2E' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0', padding: '20px 16px' }}>
        {[
          { icon: '🛡️', title: 'Buyer Protection', desc: 'Full refund if item not received' },
          { icon: '🔒', title: 'Secure Payments', desc: '100% secure transaction' },
          { icon: '🚚', title: 'Fast Delivery', desc: 'Delivery across Pakistan' },
          { icon: '↩️', title: 'Easy Returns', desc: '7-day hassle-free returns' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', borderRight: '1px solid #2E2E2E' }}>
            <span style={{ fontSize: '1.6rem' }}>{icon}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#eee' }}>{title}</div>
              <div style={{ fontSize: '11px', color: '#777' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* ── Main Footer ────────────────────────────────────────────────────────── */}
    <div className="container" style={{ padding: '40px 16px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px', marginBottom: '32px' }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #E62E04, #FF6A00)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>V</div>
            <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.02em' }}>VENDORA</span>
          </div>
          <p style={{ fontSize: '12px', lineHeight: 1.8, maxWidth: '200px', color: '#777' }}>
            Pakistan's modern marketplace. Empowering small businesses to sell smart and grow faster.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {[{ icon: '📘', label: 'Facebook' }, { icon: '🐦', label: 'Twitter' }, { icon: '📸', label: 'Instagram' }, { icon: '▶️', label: 'YouTube' }].map(({ icon, label }) => (
              <button key={label} title={label} style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#999', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,46,4,0.25)'; e.currentTarget.style.color = '#FF4747'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#999'; }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Marketplace */}
        <div>
          <h4 style={{ color: '#eee', fontWeight: 700, fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Marketplace</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { to: '/products', label: 'All Products' },
              { to: '/products?category=Handmade', label: 'Handmade Crafts' },
              { to: '/products?category=Organic', label: 'Organic Foods' },
              { to: '/products?category=Clothing', label: 'Clothing & Apparel' },
              { to: '/products?category=Electronics', label: 'Electronics' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} style={{ fontSize: '12px', color: '#777', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* For Sellers */}
        <div>
          <h4 style={{ color: '#eee', fontWeight: 700, fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>For Sellers</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { to: '/signup?role=seller', label: 'Start Selling Free' },
              { to: '/seller/dashboard', label: 'Seller Dashboard' },
              { to: '/seller/products', label: 'Manage Products' },
              { to: '/seller/orders', label: 'View Orders' },
              { to: '/seller/profile', label: 'Store Profile' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} style={{ fontSize: '12px', color: '#777', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: '#eee', fontWeight: 700, fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Help Center', 'Buyer Protection', 'Report a Problem', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map(label => (
              <li key={label}>
                <span style={{ fontSize: '12px', color: '#777', cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777'}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#555', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accepted Payments</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['💳 Visa', '💳 Mastercard', '📱 JazzCash', '📱 EasyPaisa', '🏦 Bank Transfer', '💵 Cash on Delivery'].map(p => (
            <span key={p} style={{ background: '#2A2A2A', border: '1px solid #333', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', color: '#888' }}>{p}</span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', color: '#555' }}>
          © {new Date().getFullYear()} VENDORA Marketplace. All rights reserved. Made with ❤️ in Pakistan.
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Privacy', 'Terms', 'Sitemap', 'Cookies'].map(label => (
            <span key={label} style={{ fontSize: '11px', color: '#555', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
              onMouseLeave={e => e.currentTarget.style.color = '#555'}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
