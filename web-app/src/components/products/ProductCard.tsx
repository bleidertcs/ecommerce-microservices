import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

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
      <div style={{ height: '200px', background: '#f9fafb', position: 'relative' }}>
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
      
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>{product.category}</span>
          <span style={{ color: '#f59e0b', fontSize: '13px' }}>★ {product.rating}</span>
        </div>
        
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'var(--foreground)' }}>{product.name}</h3>
        
        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)' }}>
            ${Number(product.price).toFixed(2)}
          </span>
          <Link href={`/products/${product.id}`}>
             <Button variant="outline" size="sm">
               View
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
