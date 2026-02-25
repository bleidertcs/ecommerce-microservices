"use client";

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';

interface Product {
  id: string;
  name: string;
  price: number;
  featured: boolean;
  images: string[];
  rating: number;
  category: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const url = `${API_BASE}/api/v1/products${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { cache: 'no-store' });
      
      if (!res.ok) throw new Error('Failed to fetch products');
      
      const json = await res.json();
      
      if (Array.isArray(json)) setProducts(json);
      else if (Array.isArray(json.data)) setProducts(json.data);
      else if (Array.isArray(json.products)) setProducts(json.products);
      else setProducts([]);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice]);

  return (
    <div style={{ padding: '40px 0', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.5px' }}>Discover Products</h1>
          <p style={{ color: 'var(--muted)', fontSize: '16px' }}>Explore our curated collection of premium goods.</p>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '14px', fontWeight: '500' }}>
          Showing {products.length} results
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* Sidebar Filters */}
        <aside style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '24px' }}>
          <div className="card" style={{ padding: '24px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--foreground)' }}>Filter Catalog</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)' }}>SEARCH</label>
              <div style={{ position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  type="text" 
                  placeholder="Find something..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)' }}>CATEGORY</label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', appearance: 'none', transition: 'border-color 0.2s', outline: 'none', cursor: 'pointer' }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Toys">Toys</option>
                  <option value="Sports">Sports</option>
                  <option value="Automotive">Automotive</option>
                </select>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '12px', top: '12px', pointerEvents: 'none', color: '#9ca3af' }}><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--muted)' }}>PRICE RANGE</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af', fontSize: '14px' }}>$</span>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 24px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                  />
                </div>
                <span style={{ color: 'var(--muted)' }}>-</span>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#9ca3af', fontSize: '14px' }}>$</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ width: '100%', padding: '10px 10px 10px 24px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
                  />
                </div>
              </div>
            </div>

            <Button 
              variant="secondary" 
              onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }} 
              style={{ width: '100%', padding: '10px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              Reset Filters
            </Button>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{ padding: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: 'var(--muted)', fontSize: '16px', fontWeight: '500' }}>Loading products...</p>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}} />
            </div>
          ) : products.length === 0 ? (
            <div className="card" style={{ padding: '64px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.5)', borderStyle: 'dashed' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--muted)', opacity: 0.1, borderRadius: '50%', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--foreground)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: '700' }}>No products found</h2>
              <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '400px' }}>We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
              <Button style={{ marginTop: '24px' }} onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }}>Clear all filters</Button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '32px' 
            }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
