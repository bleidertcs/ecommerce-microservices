'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function CartButton() {
  const { cartCount } = useCart();

  return (
    <a href="/cart" style={{ 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center',
      textDecoration: 'none',
      color: 'inherit'
    }}>
      <span style={{ fontSize: '24px' }}>🛒</span>
      {cartCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-8px',
          right: '-8px',
          backgroundColor: '#ff4d4f',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 6px',
          fontSize: '12px',
          fontWeight: 'bold',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {cartCount}
        </span>
      )}
      <span style={{ marginLeft: '8px', fontWeight: '500' }}>Cart</span>
    </a>
  );
}
