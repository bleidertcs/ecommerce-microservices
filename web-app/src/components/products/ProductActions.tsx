'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

export default function ProductActions({
  productId,
  price,
  productName,
  productImage
}: {
  productId: string,
  price: number,
  productName?: string,
  productImage?: string
}) {
  const { token, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: productName || 'Product',
      price: price,
      image: productImage
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: [
           { productId, quantity: 1, price }
        ],
        shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA",
            recipientName: "Demo User",
            recipientPhone: "+1234567890"
        },
        paymentMethod: "Credit Card"
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert('Order failed: ' + (err.message || 'Unknown error'));
        return;
      }

      const data = await res.json();
      alert('Order Placed Successfully! ID: ' + data.id);
      router.push('/orders');

    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <Button
        variant="primary"
        size="lg"
        style={{ flex: 1, minWidth: '150px' }}
        onClick={handleBuyNow}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </Button>
      <Button
        variant={added ? "secondary" : "secondary"}
        size="lg"
        style={{
          flex: 1,
          minWidth: '150px',
          borderColor: added ? 'var(--success, #22c55e)' : 'var(--border)',
          color: added ? 'white' : 'inherit',
          backgroundColor: added ? 'var(--success, #22c55e)' : 'transparent'
        }}
        onClick={handleAddToCart}
      >
        {added ? '✓ Added!' : 'Add to Cart'}
      </Button>
    </div>
  );
}
