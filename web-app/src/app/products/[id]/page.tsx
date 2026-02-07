import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductActions from '@/components/products/ProductActions';
import { API_BASE_URL } from '@/lib/config';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  featured: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  stock: number;
  brand: string;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Product not found</h1>
        <Link href="/products"><Button variant="secondary">Back to Products</Button></Link>
      </div>
    );
  }

  const image = product.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div style={{ padding: '32px 0' }}>
      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--muted)', marginBottom: '24px', fontSize: '14px' }}>
        ← Back to Products
      </Link>
      
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', padding: '32px' }}>
        {/* Image */}
        <div style={{ background: '#f9fafb', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
          <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
             <span style={{ color: 'var(--primary)', fontWeight: '500', textTransform: 'uppercase', fontSize: '13px' }}>
               {product.brand} • {product.category}
             </span>
             <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0' }}>{product.name}</h1>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
               <span style={{ color: '#f59e0b' }}>★ {product.rating}</span>
               <span style={{ color: 'var(--muted)' }}>({product.reviewCount} reviews)</span>
             </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: '1.7', marginBottom: '24px' }}>
            {product.description || 'No description available for this product.'}
          </p>
          
          <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
              ${Number(product.price).toFixed(2)}
            </p>
            <ProductActions productId={product.id} price={product.price} />
            <p style={{ marginTop: '12px', fontSize: '13px', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
