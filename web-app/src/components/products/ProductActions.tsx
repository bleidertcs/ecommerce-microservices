'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProductActions({ productId, price }: { productId: string, price: number }) {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: [
           { productId, quantity: 1 }
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
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button 
        variant="primary" 
        size="lg"
        style={{ flex: 1 }}
        onClick={handleBuyNow}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Buy Now'}
      </Button>
      <Button variant="secondary" size="lg">
        Add to Cart
      </Button>
    </div>
  );
}
