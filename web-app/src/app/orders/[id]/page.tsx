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
          if (res.status === 404) throw new Error('Order not found');
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

    if (id) fetchOrder();
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
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '80px 48px' }}>
          <h2 className="display-small">Identification Required</h2>
          <p className="text-muted" style={{ marginBottom: '32px' }}>Please establish your identity to access these records.</p>
          <Link href="/login"><Button variant="primary" glow>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="container section-padding" style={{ textAlign: 'center', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner"></div>
      <style jsx>{`.spinner { width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !order) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '60px', border: '1px solid var(--danger)' }}>
          <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Terminal Error</h2>
          <p className="text-muted" style={{ marginBottom: '24px' }}>{error || 'The requested acquisition record does not exist in our database.'}</p>
          <Button variant="glass" onClick={() => router.push('/orders')}>Return to History</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding animate-fade-in">
      <div className="order-details-header">
        <Link href="/orders" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          History
        </Link>
        <h1 className="display-small">Acquisition Matrix</h1>
        <div className="order-badge">
           <span className="dot" style={{ backgroundColor: order.status === 'PAID' ? 'var(--success)' : 'var(--warning)' }}></span>
           {order.status}
        </div>
      </div>

      <div className="details-layout">
        <main className="main-content">
          {/* Order Info Card */}
          <div className="glass-card info-card">
            <div className="card-header">
              <div className="id-block">
                <span className="label">Unique Identifier</span>
                <span className="val">{order.id.toUpperCase()}</span>
              </div>
              <div className="date-block">
                <span className="label">Timestamp</span>
                <span className="val">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <h3 className="section-title">Artifacts</h3>
            <div className="items-list">
              {order.items?.map((item, index) => (
                <div key={index} className="order-item-row">
                  <div className="item-info">
                    <p className="item-name">{item.productName}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    <p className="total-val">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="unit-val">${Number(item.price).toFixed(2)} / unit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <aside className="sidebar">
          {/* Summary Card */}
          <div className="glass-card summary-card">
             <h3 className="section-title">Matrix Summary</h3>
             <div className="summary-row">
                <span className="label">Status</span>
                <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
             </div>
             <div className="summary-row">
                <span className="label">Total Value</span>
                <span className="val-total">${Number(order.total).toFixed(2)}</span>
             </div>
             {order.paymentMethod && (
               <div className="summary-row" style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                 <span className="label">Protocol</span>
                 <span className="val-method">{order.paymentMethod}</span>
               </div>
             )}
             {order.status === 'PENDING' && (
               <div className="payment-action">
                 <Button glow variant="primary" onClick={handlePayment} style={{ width: '100%', justifyContent: 'center' }}>Execute Payment</Button>
               </div>
             )}
          </div>

          {/* Shipping Card */}
          {order.shippingAddress && (
            <div className="glass-card shipping-card">
              <h3 className="section-title">Relay Coordinates</h3>
              <div className="address-block">
                <p className="recipient">{order.shippingAddress.recipientName}</p>
                <p className="address-line">{order.shippingAddress.street}</p>
                <p className="address-line">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="address-line territory">{order.shippingAddress.country}</p>
                <p className="phone">Signal: {order.shippingAddress.recipientPhone}</p>
              </div>
            </div>
          )}
        </aside>
      </div>

      <style jsx>{`
        .order-details-header {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 32px;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          font-weight: 600;
          font-size: 14px;
          transition: 0.3s;
        }

        .back-link:hover { color: var(--primary); transform: translateX(-4px); }

        .order-badge {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .dot { width: 6px; height: 6px; border-radius: 50%; }

        .details-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .info-card { padding: 40px; }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 48px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }

        .label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
          letter-spacing: 0.1em;
        }

        .val { font-size: 14px; font-weight: 600; font-family: var(--font-heading); }

        .section-title {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--muted);
          margin-bottom: 24px;
        }

        .order-item-row {
          display: flex;
          justify-content: space-between;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          margin-bottom: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .item-name { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
        .item-qty { font-size: 13px; color: var(--muted); font-weight: 500; }
        
        .item-price { text-align: right; }
        .total-val { font-size: 18px; font-weight: 700; color: var(--foreground); }
        .unit-val { font-size: 12px; color: var(--muted); }

        .sidebar { display: flex; flexDirection: column; gap: 24px; }
        
        .summary-card, .shipping-card { padding: 32px; }
        
        .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        
        .status-pill { padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,255,255,0.1); }
        .status-pill.paid { color: var(--success); background: rgba(0, 229, 255, 0.05); border-color: rgba(0, 229, 255, 0.2); }
        .status-pill.pending { color: var(--warning); background: rgba(255, 204, 0, 0.05); border-color: rgba(255, 204, 0, 0.2); }

        .val-total { font-size: 28px; font-weight: 800; color: var(--primary); font-family: var(--font-heading); }
        .val-method { font-size: 14px; font-weight: 600; }
        .payment-action { margin-top: 32px; }

        .address-block p { margin-bottom: 4px; font-size: 15px; }
        .recipient { font-weight: 700; margin-bottom: 8px !important; color: var(--foreground); }
        .address-line { color: rgba(255,255,255,0.7); }
        .phone { margin-top: 12px !important; font-size: 13px !important; font-weight: 600; color: var(--primary); }

        @media (max-width: 1024px) {
          .details-layout { grid-template-columns: 1fr; }
          .sidebar { order: -1; }
        }
      `}</style>
    </div>
  );
}
