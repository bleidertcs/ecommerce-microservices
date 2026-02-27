"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import { ApiService } from '@/services/api.service';
import { Product, FilterParams } from '@/types/product.types';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const updateFilters = (newFilters: Partial<FilterParams>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters: FilterParams = {
          search,
          category,
          minPrice,
          maxPrice
        };
        const data = await ApiService.getProducts(filters);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [search, category, minPrice, maxPrice]);

  return (
    <div className="container section-padding animate-fade-in">
      <div className="products-header">
        <div className="header-content">
          <h1 className="display-medium">Showcase</h1>
          <p className="text-muted">Discover our complete collection of luxury tech.</p>
        </div>
        <div className="results-count">
          <span className="count">{products.length}</span> items found
        </div>
      </div>

      <div className="products-layout">
        <aside className="filters-sidebar">
          <div className="glass-card filters-container">
            <h3 className="filters-title">Explore</h3>
            
            <div className="filter-group">
              <label>Search</label>
              <input 
                type="text" 
                placeholder="Universal search..." 
                value={search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="input premium-input"
              />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select 
                value={category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="input premium-input select-input"
              >
                <option value="">All Worlds</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home">Home</option>
                <option value="Toys">Toys</option>
                <option value="Sports">Sports</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Value Range</label>
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  className="input premium-input"
                />
                <span className="price-divider">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  className="input premium-input"
                />
              </div>
            </div>

            <Button 
              variant="secondary" 
              onClick={resetFilters} 
              className="reset-btn"
            >
              Reset World
            </Button>
          </div>
        </aside>

        <main className="products-main">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Scanning Lumina Database...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="glass-card empty-state">
              <div className="empty-icon">∅</div>
              <h2>No items found in this world</h2>
              <p className="text-muted">Adjust your filters to reveal hidden treasures.</p>
              <Button style={{ marginTop: '24px' }} onClick={resetFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 32px;
        }

        .results-count {
          font-weight: 600;
          color: var(--muted);
          font-size: 14px;
        }

        .count {
          color: var(--primary);
          font-size: 18px;
          font-family: var(--font-heading);
        }

        .products-layout {
          display: flex;
          gap: 48px;
        }

        .filters-sidebar {
          width: 280px;
          flex-shrink: 0;
          position: sticky;
          top: 100px;
        }

        .filters-container {
          padding: 24px;
        }

        .filters-title {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
          color: var(--muted);
        }

        .filter-group {
          margin-bottom: 24px;
        }

        .filter-group label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          color: var(--muted);
        }

        .premium-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 12px !important;
          padding: 10px 14px !important;
          font-size: 13px !important;
          width: 100%;
        }

        .premium-input:focus {
          border-color: var(--primary) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .price-divider {
          color: var(--muted);
          font-size: 12px;
        }

        :global(.reset-btn) {
          width: 100% !important;
          justify-content: center !important;
          font-size: 12px !important;
          padding: 10px !important;
        }

        .products-main {
          flex: 1;
          min-width: 0;
        }

        :global(.product-grid) {
          width: 100%;
          gap: 24px !important;
        }

        .loader-container {
          height: 400px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .empty-state {
          padding: 80px 40px;
          text-align: center;
          border-style: dashed;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.2;
        }

        @media (max-width: 1400px) {
          :global(.product-grid) { grid-template-columns: repeat(3, 1fr) !important; }
        }

        @media (max-width: 1100px) {
          .products-layout { gap: 32px; }
          .filters-sidebar { width: 240px; }
          :global(.product-grid) { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 900px) {
          .products-layout { flex-direction: column; }
          .filters-sidebar { width: 100%; position: static; }
        }

        @media (max-width: 600px) {
          :global(.product-grid) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Initializing...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
