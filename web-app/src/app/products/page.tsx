import React from 'react';
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/products`, { 
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const json = await res.json();
    
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.data)) return json.data;
    if (Array.isArray(json.products)) return json.products;
    
    return []; 
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '4px' }}>Products</h1>
          <p style={{ color: 'var(--muted)' }}>Browse our collection</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
           <Button variant="secondary" size="sm">Filter</Button>
           <Button variant="secondary" size="sm">Sort</Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px', fontSize: '20px' }}>No products found</h2>
          <p style={{ color: 'var(--muted)' }}>
            Make sure the backend services are running.
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '24px' 
        }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
