"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Link from 'next/link';

function parseJwt(token: string) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function ProfilePage() {
  const { token, isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUser({
          id: decoded.sub || decoded.id || 'Unknown',
          name: decoded.name || decoded.preferred_username || 'User',
          email: decoded.email || 'No email provided',
          role: decoded.role || 'User'
        });
      }
    }
  }, [token]);

  if (!isAuthenticated || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Please sign in to view your profile</h2>
        <Link href="/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 0', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px' }}>My Profile</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '32px' }}>
        {/* User Info Card */}
        <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ 
            width: '96px', 
            height: '96px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '600',
            margin: '0 auto 16px'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>{user.name}</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{user.email}</p>
          <Button variant="outline" onClick={logout} style={{ width: '100%' }}>
            Sign Out
          </Button>
        </div>

        {/* Account Details & Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Account Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>User ID</span>
                <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>{user.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Email Address</span>
                <span style={{ fontWeight: '500' }}>{user.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Role</span>
                <span className="badge badge-success">{user.role || 'User'}</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="/orders" style={{ flex: 1 }}>
                <Button variant="secondary" style={{ width: '100%' }}>View My Orders</Button>
              </Link>
              <Link href="/cart" style={{ flex: 1 }}>
                <Button variant="secondary" style={{ width: '100%' }}>Shopping Cart</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
