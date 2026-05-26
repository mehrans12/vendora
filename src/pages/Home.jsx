import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ProductCard } from '../components/buyer/ProductCard';
import * as storage from '../utils/storage';
import { CATEGORIES, CATEGORY_ICONS, formatPKR } from '../utils/helpers';

// ── Countdown Timer ──────────────────────────────────────────────────────────
const useCountdown = (seconds) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining(r => (r <= 1 ? seconds : r - 1)), 1000);
    return () => clearInterval(t);
  }, [seconds]);
  const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  return { h, m, s };
};

// ── Promo Banners ────────────────────────────────────────────────────────────
const BANNERS = [
  { title: 'Flash Sale Today!', sub: 'Up to 60% OFF on top products', cta: 'Shop Now', bg: 'linear-gradient(135deg,#E62E04 0%,#FF6A00 100%)', emoji: '⚡' },
  { title: 'New Arrivals', sub: 'Freshly listed handmade goods from Pakistan', cta: 'Explore', bg: 'linear-gradient(135deg,#7C3AED 0%,#2563EB 100%)', emoji: '🆕' },
  { title: 'Organic & Natural', sub: 'Pure, farm-fresh products delivered to you', cta: 'Browse', bg: 'linear-gradient(135deg,#00AE4D 0%,#0EA5E9 100%)', emoji: '🌿' },
];

export default function Home() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const { h, m, s } = useCountdown(3 * 3600 + 42 * 60 + 15);
  const navigate = useNavigate();

  const allProducts = useMemo(() => storage.products.getActive(), []);
  const flashDeals  = useMemo(() => [...allProducts].sort((a,b) => (b.reviews||0)-(a.reviews||0)).slice(0,8), [allProducts]);
  const featured    = useMemo(() => allProducts, [allProducts]);

  // Auto-rotate banner
  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const banner = BANNERS[bannerIdx];

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section style={{ background: '#F5F5F5', padding: '12px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '12px', alignItems: 'stretch' }}
            className="hero-banner-grid">

            {/* Main Banner */}
            <div style={{ borderRadius: '8px', overflow: 'hidden', background: banner.bg, padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 48px)', minHeight: '220px', display: 'flex', alignItems: 'center', transition: 'all 0.5s ease', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
                <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: '#fff' }} />
                <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '250px', height: '250px', borderRadius: '50%', background: '#000' }} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '12px', animation: 'fadeIn 0.4s ease' }}>{banner.emoji}</div>
                <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '8px', lineHeight: 1.1, animation: 'slideUp 0.4s ease' }}>
                  {banner.title}
                </h1>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.88)', marginBottom: '20px', animation: 'slideUp 0.4s ease 0.1s both' }}>
                  {banner.sub}
                </p>
                <Link to="/products" className="btn" style={{ background: '#fff', color: '#E62E04', fontWeight: 800, fontSize: '15px', height: '46px', padding: '0 28px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', animation: 'slideUp 0.4s ease 0.2s both' }}>
                  {banner.cta} →
                </Link>
              </div>

              {/* Banner Dots */}
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                {BANNERS.map((_, i) => (
                  <button key={i} onClick={() => setBannerIdx(i)} style={{ width: i === bannerIdx ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === bannerIdx ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
            </div>

            {/* Side Promos — hidden on mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="hide-mobile">
              <div style={{ background: 'linear-gradient(135deg,#1A1A2E,#16213E)', borderRadius: '8px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🏪</div>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Start Selling</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px' }}>No website needed. Launch your store free.</div>
                <Link to="/signup?role=seller" style={{ background: '#FF6A00', color: '#fff', borderRadius: '4px', padding: '7px 16px', fontSize: '12px', fontWeight: 700, display: 'inline-block', width: 'fit-content' }}>Start Free →</Link>
              </div>
              <div style={{ background: 'linear-gradient(135deg,#0F3460,#533483)', borderRadius: '8px', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🎁</div>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '15px', marginBottom: '4px' }}>New User Offer</div>
                <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '12px' }}>Sign up and get exclusive first-order deals!</div>
                <Link to="/signup" style={{ background: '#E62E04', color: '#fff', borderRadius: '4px', padding: '7px 16px', fontSize: '12px', fontWeight: 700, display: 'inline-block', width: 'fit-content' }}>Join Now →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLASH DEALS ───────────────────────────────────────────────────── */}
      {flashDeals.length > 0 && (
        <section style={{ padding: '20px 0', background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
          <div className="container">
            <div className="section-head">
              <div className="section-title">
                <span>⚡</span> Flash Deals
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '16px', background: '#1A1A1A', padding: '4px 10px', borderRadius: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '11px', fontWeight: 600, marginRight: '4px' }}>Ends in:</span>
                  <span className="flash-time-box">{h}</span>
                  <span className="flash-colon">:</span>
                  <span className="flash-time-box">{m}</span>
                  <span className="flash-colon">:</span>
                  <span className="flash-time-box">{s}</span>
                </div>
              </div>
              <Link to="/products" className="section-more">View All →</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
              {flashDeals.map((p, i) => (
                <div key={p.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section style={{ padding: '24px 0', background: '#F5F5F5' }}>
        <div className="container">
          <div className="section-head">
            <div className="section-title">🏷️ Shop by Category</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
            {CATEGORIES.map((cat, i) => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} style={{ textDecoration: 'none', animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                <div className="cat-chip">
                  <span className="cat-chip-icon">{CATEGORY_ICONS[cat]}</span>
                  <span className="cat-chip-label">{cat}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO STRIP ───────────────────────────────────────────────────── */}
      <section style={{ padding: '16px 0', background: '#E62E04' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { icon: '🚚', text: 'Free Shipping on all orders' },
            { icon: '🔒', text: 'Secure Buyer Protection' },
            { icon: '↩️', text: 'Easy 7-Day Returns' },
            { icon: '📦', text: 'Fast Delivery Across Pakistan' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span> {text}
            </div>
          ))}
        </div>
      </section>

      {/* ── JUST FOR YOU ──────────────────────────────────────────────────── */}
      <section style={{ padding: '24px 0', background: '#F5F5F5' }}>
        <div className="container">
          <div className="section-head">
            <div className="section-title">✨ Just For You</div>
            <Link to="/products" className="section-more">See All →</Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {featured.map((p, i) => (
                <div key={p.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.04}s both` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🛍️</div>
              <div className="empty-state-title">No products yet</div>
              <div className="empty-state-desc">Be the first seller to list products!</div>
              <Link to="/signup?role=seller" className="btn btn-primary">Start Selling</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── SELLER CTA ────────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg,#1A1A2E 0%,#16213E 60%,#0F3460 100%)', borderRadius: '12px', padding: 'clamp(24px,5vw,48px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(230,46,4,0.12)' }} />
            <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,106,0,0.1)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
              <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                Ready to Start Selling on VENDORA?
              </h2>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
                Join 500+ Pakistani sellers. No website needed. Launch your store in minutes — completely free.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/signup?role=seller" className="btn btn-orange btn-lg" style={{ fontWeight: 800 }}>
                  🏪 Start Selling Free
                </Link>
                <Link to="/products" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                  Browse Marketplace
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
                {[['500+','Active Sellers'],['10K+','Products'],['50K+','Happy Buyers']].map(([v,l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FF6A00' }}>{v}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
