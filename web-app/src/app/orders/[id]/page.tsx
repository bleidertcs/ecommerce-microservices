'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: {
    recipientName: string;
    recipientPhone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
}

export default function OrderDetailsPage() {
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          if (res.status === 404) {
             throw new Error('Order not found');
          }
          throw new Error('Failed to fetch order details');
        }
        
        const data = await res.json();
        setOrder(data.data || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, token, isAuthenticated]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${id}/pay`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Payment simulation failed');
      
      const updatedOrder = await res.json();
      setOrder(updatedOrder.data || updatedOrder);
      alert('Payment successful!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Please sign in to view this order</h2>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading order details...</div>;

  if (error || !order) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Error</h2>
        <p style={{ marginBottom: '24px' }}>{error || 'Order not found'}</p>
        <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
      </div>
    );
  }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Order Details</h1>
        <Button variant="outline" onClick={() => router.push('/orders')}>Back to Orders</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>Order ID</p>
                <p style={{ fontWeight: '600' }}>{order.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '4px' }}>Date</p>
                <p style={{ fontWeight: '500' }}>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items?.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.productName}</p>
                      <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>${Number(item.price).toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Order Summary</h3>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--muted)' }}>Status</span>
                <span className={`badge ${getStatusBadge(order.status)}`}>{order.status}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--muted)' }}>Total Amount</span>
                <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--primary)' }}>${Number(order.total).toFixed(2)}</span>
             </div>
             {order.paymentMethod && (
               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                 <span style={{ color: 'var(--muted)' }}>Payment Method</span>
                 <span style={{ fontWeight: '500' }}>{order.paymentMethod}</span>
               </div>
             )}
             {order.status === 'PENDING' && (
               <div style={{ marginTop: '24px' }}>
                 <Button onClick={handlePayment} style={{ width: '100%' }}>Pay Now</Button>
               </div>
             )}
          </div>

          {order.shippingAddress && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Shipping details</h3>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>{order.shippingAddress.recipientName}</p>
              <p style={{ color: 'var(--muted)', marginBottom: '4px', fontSize: '14px' }}>{order.shippingAddress.street}</p>
              <p style={{ color: 'var(--muted)', marginBottom: '8px', fontSize: '14px' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p style={{ color: 'var(--muted)', marginBottom: '8px', fontSize: '14px' }}>{order.shippingAddress.country}</p>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Phone: {order.shippingAddress.recipientPhone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
