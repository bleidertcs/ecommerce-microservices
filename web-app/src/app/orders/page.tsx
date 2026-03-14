'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';
import Alert from '@/components/ui/Alert';
import { API_BASE_URL } from '@/lib/config';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const { token, isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const { showModal } = useModal();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchOrders();
  }, [token, isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('No se pudieron cargar los pedidos');
      
      const data = await res.json();
      const orderList = Array.isArray(data) ? data : data.data || [];
      setOrders(orderList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (orderId: string) => {
    setPayingId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}/pay`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error en el pago');
      }

      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: 'PAID' } : o)
      );
      showModal({
        type: 'success',
        title: 'Créditos Verificados',
        message: 'La transacción ha sido procesada con éxito. El estado de tu pedido ha sido actualizado.',
      });
    } catch (err: any) {
      showModal({
        type: 'error',
        title: 'Error de Procesamiento',
        message: 'No se pudo completar la transferencia de créditos: ' + err.message,
      });
    } finally {
      setPayingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container section-padding animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="glass-card auth-empty-state">
           <h2 className="display-small">Acceso No Autorizado</h2>
           <p className="text-muted" style={{ marginBottom: '32px' }}>Por favor, identifícate para ver tu historial de pedidos.</p>
           <Link href="/login"><Button variant="primary" glow>Iniciar Sesión</Button></Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container section-padding loader-container">
        <div className="spinner"></div>
        <p>Retrieving transaction history...</p>
        <style jsx>{`
          .loader-container { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
          .spinner { width: 48px; height: 48px; border: 2px solid rgba(255, 255, 255, 0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'PAID': return { label: 'Pagado', color: 'var(--success)' };
      case 'PENDING': return { label: 'Pendiente', color: 'var(--warning)' };
      case 'CANCELLED': return { label: 'Cancelado', color: 'var(--danger)' };
      default: return { label: status, color: 'var(--muted)' };
    }
  };

  return (
    <div className="container section-padding animate-fade-in">
      <div className="orders-header">
        <h1 className="display-medium">Historial de Pedidos</h1>
        <p className="text-muted">Una línea de tiempo de tus adquisiciones tecnológicas.</p>
      </div>
      
      {error && (
        <Alert type="error" className="mb-8">
          Error en la transmisión: {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <div className="glass-card empty-orders">
          <p className="text-muted" style={{ fontSize: '18px', marginBottom: '32px' }}>No se registraron transacciones en este ciclo.</p>
          <Link href="/products"><Button variant="primary" glow>Iniciar Adquisición</Button></Link>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const status = getStatusInfo(order.status);
            return (
              <div key={order.id} className="glass-card order-item">
                <div className="order-main">
                  <div className="order-id">
                    <span className="label">Order ID</span>
                    <span className="val">#{order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="order-date">
                    <span className="label">Timestamp</span>
                    <span className="val">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="order-status">
                    <span className="status-dot" style={{ backgroundColor: status.color, boxShadow: `0 0 10px ${status.color}` }}></span>
                    <span style={{ color: status.color, fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>{status.label}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span className="label">Total Investment</span>
                    <span className="amount">${Number(order.total).toFixed(2)}</span>
                  </div>
                  
                  <div className="order-actions">
                    {order.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        size="sm"
                        glow
                        onClick={() => handlePay(order.id)}
                        disabled={payingId === order.id}
                      >
                        {payingId === order.id ? 'Processing...' : '💳 Pay Now'}
                      </Button>
                    )}
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="glass" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .orders-header {
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 32px;
        }

        .orders-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .order-item {
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: var(--transition-smooth);
        }

        .order-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .order-main {
          display: flex;
          gap: 48px;
          align-items: center;
        }

        .label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }

        .val {
          font-size: 16px;
          font-weight: 600;
          font-family: var(--font-heading);
        }

        .order-status {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          padding: 6px 12px;
          border-radius: 99px;
          border: 1px solid var(--border);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .order-footer {
          display: flex;
          align-items: center;
          gap: 48px;
          text-align: right;
        }

        .amount {
          font-size: 24px;
          font-weight: 800;
          color: var(--primary);
          font-family: var(--font-heading);
        }

        .order-actions {
          display: flex;
          gap: 12px;
        }

        .empty-orders, .auth-empty-state {
          padding: 100px 48px;
          text-align: center;
        }

        .error-alert {
          padding: 20px;
          color: var(--danger);
          margin-bottom: 24px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .order-item { flex-direction: column; gap: 32px; align-items: flex-start; }
          .order-main { gap: 32px; flex-wrap: wrap; }
          .order-footer { width: 100%; justify-content: space-between; text-align: left; }
        }
      `}</style>
    </div>
  );
}
