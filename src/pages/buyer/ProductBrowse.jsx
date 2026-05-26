import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ProductCard } from '../../components/buyer/ProductCard';
import * as storage from '../../utils/storage';
import { CATEGORIES, CATEGORY_ICONS } from '../../utils/helpers';

const SORT_OPTIONS = [
  { value: 'default',   label: 'Best Match' },
  { value: 'orders',    label: 'Most Orders' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc',label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'newest',    label: 'Newest First' },
];

export default function ProductBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceMax, setPriceMax] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || '';
  const sort     = searchParams.get('sort')     || 'default';
  const freeShip = searchParams.get('freeShip') === '1';

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  const allProducts = useMemo(() => storage.products.getActive(), []);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (search)   list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description||'').toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter(p => p.category === category);
    if (priceMin) list = list.filter(p => p.price >= Number(priceMin));
    if (priceMax) list = list.filter(p => p.price <= Number(priceMax));
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
      case 'price-desc': list.sort((a,b) => b.price - a.price); break;
      case 'rating':     list.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
      case 'orders':     list.sort((a,b) => (b.reviews||0) - (a.reviews||0)); break;
      case 'newest':     list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }
    return list;
  }, [allProducts, search, category, sort, priceMin, priceMax, freeShip]);

  const clearFilters = () => { setSearchParams({}); setPriceMin(''); setPriceMax(''); };

  const Sidebar = () => (
    <aside style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: '6px', padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1A1A1A' }}>🔽 Filters</span>
        <button onClick={clearFilters} style={{ fontSize: '12px', color: '#E62E04', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear All</button>
      </div>

      {/* Categories */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Category</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <button onClick={() => setParam('category', '')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '4px', border: 'none', background: !category ? '#FFF0EE' : 'transparent', color: !category ? '#E62E04' : '#555', fontSize: '13px', fontWeight: !category ? 700 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
            📦 All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setParam('category', cat)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', borderRadius: '4px', border: 'none', background: category === cat ? '#FFF0EE' : 'transparent', color: category === cat ? '#E62E04' : '#555', fontSize: '13px', fontWeight: category === cat ? 700 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
              onMouseEnter={e => { if (category !== cat) e.currentTarget.style.background = '#f8f8f8'; }}
              onMouseLeave={e => { if (category !== cat) e.currentTarget.style.background = 'transparent'; }}>
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Price (PKR)</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} className="form-input" style={{ padding: '6px 8px', fontSize: '12px' }} />
          <span style={{ color: '#bbb', fontSize: '12px', flexShrink: 0 }}>—</span>
          <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} className="form-input" style={{ padding: '6px 8px', fontSize: '12px' }} />
        </div>
      </div>

      {/* Rating */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Min Rating</div>
        {[4,3,2].map(r => (
          <button key={r} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#555', width: '100%' }}>
            <span style={{ color: '#FFB800' }}>{'★'.repeat(r)}{'☆'.repeat(5-r)}</span> & up
          </button>
        ))}
      </div>
    </aside>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="container">

          {/* Breadcrumb */}
          <div className="breadcrumb" style={{ marginBottom: '12px' }}>
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            {category ? <><Link to="/products">All Products</Link><span className="breadcrumb-sep">›</span><span className="breadcrumb-curr">{category}</span></> : <span className="breadcrumb-curr">All Products</span>}
          </div>

          {/* Sort & Filter Bar */}
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: '6px', padding: '10px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#888', whiteSpace: 'nowrap' }}>
              <strong style={{ color: '#1A1A1A' }}>{filtered.length}</strong> results {search && `for "${search}"`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap' }}>Sort by:</span>
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setParam('sort', opt.value)} style={{
                  padding: '5px 12px', borderRadius: '4px', border: `1px solid ${sort === opt.value ? '#E62E04' : '#e0e0e0'}`,
                  background: sort === opt.value ? '#FFF0EE' : '#fff',
                  color: sort === opt.value ? '#E62E04' : '#555',
                  fontSize: '12px', fontWeight: sort === opt.value ? 700 : 400,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                }}>{opt.label}</button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '12px', alignItems: 'start' }}>
            <div className="hide-mobile"><Sidebar /></div>

            <div>
              {filtered.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                  {filtered.map((p, i) => (
                    <div key={p.id} style={{ animation: `fadeIn 0.3s ease ${Math.min(i,10) * 0.04}s both` }}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #e8e8e8' }}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <div className="empty-state-title">No products found</div>
                    <div className="empty-state-desc">Try adjusting your search or filters</div>
                    <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
