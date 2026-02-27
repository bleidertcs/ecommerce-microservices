'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { getCasdoorLoginUrl } from '@/lib/casdoor-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8010';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    recipientName: '',
    recipientPhone: ''
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      window.location.href = getCasdoorLoginUrl();
      return;
    }

    if (cart.length === 0) return;

    if (!shippingAddress.recipientName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode || !shippingAddress.country || !shippingAddress.recipientPhone) {
      alert('Please fill out all shipping address fields.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          recipientName: shippingAddress.recipientName,
          recipientPhone: shippingAddress.recipientPhone
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
        throw new Error(err.message || 'Failed to place order');
      }

      const data = await res.json();
      alert('Order Placed Successfully! ID: ' + data.id);
      clearCart();
      router.push('/orders');
      
    } catch (error: any) {
      console.error(error);
      alert('Checkout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container section-padding animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="glass-card empty-cart-card">
          <div className="empty-icon">🛒</div>
          <h1 className="display-small">Your Vessel is Empty</h1>
          <p className="text-muted" style={{ marginBottom: '40px' }}>
            There are no tech artifacts currently in your possession.
          </p>
          <Link href="/products">
            <Button variant="primary" glow size="lg">Discover Essentials</Button>
          </Link>
        </div>
        <style jsx>{`
          .empty-cart-card {
            padding: 80px 48px;
            max-width: 600px;
            margin: 0 auto;
          }
          .empty-icon { font-size: 64px; margin-bottom: 24px; opacity: 0.3; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container section-padding animate-fade-in">
      <div className="cart-header">
        <h1 className="display-medium">Checkout Flow</h1>
        <div className="auth-status">
          <div className={`status-pill ${isAuthenticated ? 'authenticated' : 'unauthorized'}`}>
            <span className="dot"></span>
            {isAuthenticated ? 'Secured Selection' : 'Unidentified Asset'}
          </div>
        </div>
      </div>
      
      <div className="cart-layout">
        <div className="cart-main">
          {/* Cart Items Area */}
          <div className="items-list">
            <h2 className="section-title">Artifacts</h2>
            {cart.map((item) => (
              <div key={item.id} className="glass-card cart-item">
                <div className="item-image-wrapper">
                  <img src={item.image || 'https://via.placeholder.com/200'} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-meta">
                    <span className="item-price">${item.price.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-val">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                
                <div className="item-total-area">
                  <div className="item-total-price">${(item.price * item.quantity).toFixed(2)}</div>
                  <button className="remove-link" onClick={() => removeFromCart(item.id)}>Discard</button>
                </div>
              </div>
            ))}
            
            <button className="clear-btn" onClick={clearCart}>Purge Entire Selection</button>
          </div>

          {/* Shipping Gateway */}
          <div className="shipping-section">
            <h2 className="section-title">Delivery Coordinates</h2>
            {!isAuthenticated ? (
               <div className="glass-card auth-required">
                  <p>Identification required to proceed with delivery protocols.</p>
                  <Button variant="primary" onClick={() => window.location.href = getCasdoorLoginUrl()}>Sign In to Lumina</Button>
               </div>
            ) : (
              <div className="glass-card address-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Recipient Full Name</label>
                    <input type="text" name="recipientName" value={shippingAddress.recipientName} onChange={handleAddressChange} className="input premium-input" placeholder="Executor Name" />
                  </div>
                  <div className="form-group">
                    <label>Encrypted Phone</label>
                    <input type="text" name="recipientPhone" value={shippingAddress.recipientPhone} onChange={handleAddressChange} className="input premium-input" placeholder="+1..." />
                  </div>
                  <div className="form-group full-width">
                    <label>Orbital Address</label>
                    <input type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} className="input premium-input" placeholder="Street, Building..." />
                  </div>
                  <div className="form-group">
                    <label>City / Hub</label>
                    <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} className="input premium-input" placeholder="New York" />
                  </div>
                  <div className="form-group">
                    <label>Sector / State</label>
                    <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} className="input premium-input" placeholder="NY" />
                  </div>
                  <div className="form-group">
                    <label>Nexus Code</label>
                    <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} className="input premium-input" placeholder="10001" />
                  </div>
                  <div className="form-group">
                    <label>Territory</label>
                    <input type="text" name="country" value={shippingAddress.country} onChange={handleAddressChange} className="input premium-input" placeholder="Earth / USA" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary Sidebar */}
        <aside className="cart-sidebar">
          <div className="glass-card summary-card sticky-sidebar">
            <h2 className="summary-title">Universal Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Core Value</span>
                <span className="val">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Quantum Shipping</span>
                <span className="val success">Included</span>
              </div>
              <div className="summary-row total-row">
                <span className="total-label">Final Investment</span>
                <span className="total-val">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              glow
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Transmitting...' : isAuthenticated ? 'Finalize Order' : 'Establish Identity'}
            </Button>
            
            {!isAuthenticated && (
              <p className="auth-hint">Session required for transaction finalization.</p>
            )}
          </div>
        </aside>
      </div>

      <style jsx>{`
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 32px;
        }

        .status-pill {
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-pill.authenticated { background: rgba(0, 229, 255, 0.1); color: var(--success); border: 1px solid rgba(0, 229, 255, 0.2); }
        .status-pill.unauthorized { background: rgba(255, 0, 85, 0.1); color: var(--danger); border: 1px solid rgba(255, 0, 85, 0.2); }

        .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 60px;
          align-items: start;
        }

        .section-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--muted);
          margin-bottom: 24px;
        }

        .items-list {
          margin-bottom: 60px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 120px 1fr auto 140px;
          gap: 32px;
          padding: 24px;
          align-items: center;
          margin-bottom: 16px;
        }

        .item-image-wrapper {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
        }

        .item-image-wrapper img { width: 100%; height: 100%; object-fit: cover; }

        .item-name { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .item-price { font-size: 15px; color: var(--primary); font-weight: 700; }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.03);
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .qty-btn { background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0 4px; }
        .qty-val { font-weight: 700; min-width: 20px; text-align: center; font-family: var(--font-heading); }

        .item-total-area { text-align: right; }
        .item-total-price { font-size: 20px; font-weight: 800; font-family: var(--font-heading); margin-bottom: 4px; }
        .remove-link { background: none; border: none; color: var(--danger); font-size: 12px; cursor: pointer; text-transform: uppercase; font-weight: 600; opacity: 0.6; transition: 0.3s; }
        .remove-link:hover { opacity: 1; }

        .clear-btn { background: none; border: none; color: var(--muted); font-size: 12px; cursor: pointer; text-transform: uppercase; font-weight: 600; margin-top: 16px; }

        .shipping-section { margin-top: 60px; }
        
        .address-form { padding: 40px; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .full-width { grid-column: span 2; }
        
        .form-group label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }

        .premium-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-top-color: rgba(255, 255, 255, 0.12) !important;
          border-radius: 12px !important;
          padding: 14px 20px !important;
          width: 100%;
        }

        .auth-required { padding: 48px; text-align: center; }
        .auth-required p { margin-bottom: 24px; color: var(--muted); }

        .summary-card { padding: 40px; }
        .summary-title { font-size: 20px; font-weight: 800; margin-bottom: 32px; font-family: var(--font-heading); }
        
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; color: var(--muted); font-size: 14px; }
        .summary-row .val { color: var(--foreground); font-weight: 600; }
        .summary-row .val.success { color: var(--success); }
        
        .total-row { border-top: 1px solid var(--border); margin-top: 24px; padding-top: 24px; color: var(--foreground); }
        .total-label { font-size: 18px; font-weight: 700; }
        .total-val { font-size: 24px; font-weight: 800; color: var(--primary); font-family: var(--font-heading); }

        :global(.checkout-btn) { width: 100% !important; margin-top: 32px !important; justify-content: center !important; }
        .auth-hint { font-size: 12px; color: var(--muted); text-align: center; margin-top: 16px; }

        .sticky-sidebar { position: sticky; top: 100px; }

        @media (max-width: 1100px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-sidebar { position: static; }
        }

        @media (max-width: 768px) {
          .cart-item { grid-template-columns: 80px 1fr; grid-template-rows: auto auto auto; }
          .item-total-area { grid-column: span 2; text-align: left; margin-top: 16px; }
          .quantity-controls { grid-column: span 2; justify-content: center; }
          .form-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}
