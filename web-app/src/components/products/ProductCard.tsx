"use client";

import React from 'react';
import Link from 'next/link';
import ProductActions from './ProductActions';
import { Product } from '@/types/product.types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = (product.images && product.images.length > 0) ? product.images[0] : undefined;

  return (
    <div className="glass-card product-card-premium">
      <Link href={`/products/${product.id}`} className="product-image-container">
        <div className="image-wrapper">
          {image ? (
            <img 
              src={image} 
              alt={product.name} 
              className="product-image"
              onError={(e) => { 
                (e.target as HTMLImageElement).style.display = 'none'; 
                (e.target as HTMLImageElement).parentElement!.classList.add('image-placeholder');
              }}
            />
          ) : (
            <div className="image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          )}
        </div>
        <div className="category-badge">{product.category}</div>
      </Link>
      
      <div className="product-info">
        <div className="product-header">
          <Link href={`/products/${product.id}`} className="product-title">
            <h3>{product.name}</h3>
          </Link>
          <div className="product-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {product.rating || '4.5'}
          </div>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            <span className="currency">$</span>
            <span className="amount">{Number(product.price).toFixed(2)}</span>
          </div>
          <ProductActions 
            productId={product.id} 
            price={product.price} 
            productName={product.name}
            productImage={image}
          />
        </div>
      </div>

      <style jsx>{`
        .product-card-premium {
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          padding: 8px;
          border-radius: 20px;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          aspect-ratio: 4/3;
        }

        .image-wrapper {
          width: 100%;
          height: 100%;
          transition: var(--transition-smooth);
        }

        .product-card-premium:hover .product-image {
          transform: scale(1.02);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%);
          color: rgba(255, 255, 255, 0.2);
        }

        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .product-info {
          padding: 12px 6px 6px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 8px;
        }

        .product-title h3 {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 700;
          color: #ffcc00;
          background: rgba(255, 204, 0, 0.1);
          padding: 2px 6px;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .product-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .product-price {
          display: flex;
          align-items: baseline;
          color: var(--foreground);
        }

        .currency {
          font-size: 12px;
          font-weight: 600;
          opacity: 0.7;
          margin-right: 2px;
        }

        .amount {
          font-size: 16px;
          font-weight: 800;
          font-family: var(--font-heading);
        }
      `}</style>
    </div>
  );
}
