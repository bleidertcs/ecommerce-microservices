'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch orders');
        
        const data = await res.json();
        const orderList = Array.isArray(data) ? data : data.data || [];
        setOrders(orderList);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Please sign in to view your orders</h2>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading orders...</div>;

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      'PAID': 'badge-success',
      'DELIVERED': 'badge-success',
      'PENDING': 'badge-warning',
      'PROCESSING': 'badge-warning',
      'CANCELLED': 'badge-danger',
      'REFUNDED': 'badge-danger',
    };
    return classes[status] || 'badge';
  };

  return (
    <div style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>My Orders</h1>
      
      {error && <p style={{ color: 'var(--danger)' }}>Error: {error}</p>}

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '16px' }}>You haven&apos;t placed any orders yet.</p>
          <Link href="/products"><Button>Browse Products</Button></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <div key={order.id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>Order #{order.id.slice(0, 8)}...</p>
                <p style={{ fontSize: '15px', fontWeight: '500' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <span className={`badge ${getStatusBadge(order.status)}`} style={{ marginTop: '8px' }}>
                  {order.status}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>
                  ${Number(order.total).toFixed(2)}
                </p>
                <Button variant="outline" size="sm" style={{ marginTop: '8px' }}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
