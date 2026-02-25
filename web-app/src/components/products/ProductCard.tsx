import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import ProductActions from './ProductActions';

interface Product {
  id: string;
  name: string;
  price: number;
  featured: boolean;
  images: string[];
  rating: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = (product.images && product.images.length > 0) ? product.images[0] : undefined;

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      height: '100%',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow)';
    }}>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: '220px', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {image ? (
            <img 
              src={image} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
              onError={(e) => { 
                (e.target as HTMLImageElement).style.display = 'none'; 
                (e.target as HTMLImageElement).parentElement!.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
              }}
            />
          ) : (
            <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span>No Image Available</span>
            </div>
          )}
          {product.featured && (
            <span style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px', 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '6px 12px', 
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Featured
            </span>
          )}
        </div>
      </Link>
      
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>{product.category}</span>
          <span style={{ color: '#f59e0b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {product.rating}
          </span>
        </div>
        
        <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', minHeight: '44px' }}>{product.name}</h3>
        </Link>
        
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <div style={{ marginBottom: '12px', fontSize: '18px', fontWeight: '700' }}>
            ${Number(product.price).toFixed(2)}
          </div>
          <ProductActions 
            productId={product.id} 
            price={product.price} 
            productName={product.name}
            productImage={image}
          />
        </div>
      </div>
    </div>
  );
}
