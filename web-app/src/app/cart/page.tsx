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
      // Redirect to Casdoor login
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
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Your cart is empty</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>Your Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map((item) => (
            <div key={item.id} className="card" style={{ padding: '16px', display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: '#f9fafb', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{item.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: '600' }}>${item.price.toFixed(2)}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                >-</button>
                <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                >+</button>
              </div>
              
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <p style={{ fontWeight: '700', fontSize: '18px' }}>${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ border: 'none', background: 'transparent', color: 'var(--danger, #ef4444)', fontSize: '13px', cursor: 'pointer', marginTop: '4px', padding: '4px' }}
                >Remove</button>
              </div>
            </div>
          ))}
          
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
            <button 
              onClick={clearCart}
              style={{ border: 'none', background: 'transparent', color: 'var(--muted)', fontSize: '14px', cursor: 'pointer' }}
            >Clear Cart</button>
          </div>

          {/* Shipping Address Form */}
          {isAuthenticated && (
            <div className="card" style={{ padding: '24px', marginTop: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Shipping Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Recipient Name</label>
                  <input type="text" name="recipientName" value={shippingAddress.recipientName} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Phone</label>
                  <input type="text" name="recipientPhone" value={shippingAddress.recipientPhone} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Street Address</label>
                  <input type="text" name="street" value={shippingAddress.street} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>City</label>
                  <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>State/Province</label>
                  <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Zip/Postal Code</label>
                  <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500' }}>Country</label>
                  <input type="text" name="country" value={shippingAddress.country} onChange={handleAddressChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }} required />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Summary */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)' }}>Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <Button 
            variant="primary" 
            size="lg" 
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : isAuthenticated ? 'Complete Purchase' : 'Sign in to Checkout'}
          </Button>
          
          {!isAuthenticated && (
            <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
              You need to be logged in to create an order.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
