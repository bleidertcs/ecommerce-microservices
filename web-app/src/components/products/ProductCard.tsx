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
  const image = product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      overflow: 'hidden',
      height: '100%'
    }}>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ height: '180px', background: '#f9fafb', position: 'relative' }}>
          <img 
            src={image} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          {product.featured && (
            <span style={{ 
              position: 'absolute', 
              top: '8px', 
              right: '8px', 
              background: 'var(--primary)', 
              color: 'white', 
              padding: '4px 10px', 
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              Featured
            </span>
          )}
        </div>
      </Link>
      
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>{product.category}</span>
          <span style={{ color: '#f59e0b', fontSize: '13px' }}>★ {product.rating}</span>
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
