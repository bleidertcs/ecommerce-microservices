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
          name: decoded.name || decoded.preferred_username || 'Lumina Pilot',
          email: decoded.email || 'No email provided',
          role: decoded.role || 'Elite Member',
          picture: decoded.picture
        });
      }
    }
  }, [token]);

  if (!isAuthenticated || !user) {
    return (
      <div className="container section-padding animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '80px 48px' }}>
          <h2 className="display-small">Access Restricted</h2>
          <p className="text-muted" style={{ marginBottom: '32px' }}>This terminal is reserved for authenticated Lumina members.</p>
          <Link href="/login"><Button variant="primary" glow>Establish Link</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding animate-fade-in">
      <div className="profile-header">
        <h1 className="display-medium">Account Matrix</h1>
        <p className="text-muted">Manage your identity and acquisition history.</p>
      </div>

      <div className="profile-grid">
        {/* Main Identity Card */}
        <div className="glass-card identity-card bento-item-large">
          <div className="avatar-wrapper">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</div>
            )}
            <div className="avatar-glow"></div>
          </div>
          
          <div className="identity-info">
            <div className="role-badge">{user.role}</div>
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
          </div>

          <div className="identity-footer">
             <Button variant="danger" className="logout-btn" onClick={logout}>Deactivate Connection</Button>
          </div>
        </div>

        {/* Info Grid (Bento) */}
        <div className="glass-card bento-info bento-item-wide">
          <h3 className="section-title">Core Data</h3>
          <div className="data-rows">
            <div className="data-row">
              <span className="label">Unique Identifier</span>
              <span className="val-mono">{user.id}</span>
            </div>
            <div className="data-row">
              <span className="label">Communication Channel</span>
              <span className="val">{user.email}</span>
            </div>
            <div className="data-row">
              <span className="label">Authorization Level</span>
              <span className="val success">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <Link href="/orders" className="glass-card bento-shortcut">
          <div className="icon">📦</div>
          <div className="shortcut-meta">
            <h4>Acquisitions</h4>
            <p>Review and track your orders</p>
          </div>
        </Link>

        <Link href="/cart" className="glass-card bento-shortcut">
          <div className="icon">🛒</div>
          <div className="shortcut-meta">
            <h4>Vessel</h4>
            <p>Manage your pending items</p>
          </div>
        </Link>
      </div>

      <style jsx>{`
        .profile-header {
          margin-bottom: 60px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 32px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .identity-card {
          padding: 60px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .avatar-wrapper {
          position: relative;
          width: 128px;
          height: 128px;
          margin-bottom: 32px;
        }

        .avatar-img, .avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 2;
          border: 4px solid rgba(255, 255, 255, 0.05);
        }

        .avatar-placeholder {
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          font-family: var(--font-heading);
        }

        .avatar-glow {
          position: absolute;
          inset: -20px;
          background: var(--primary);
          filter: blur(40px);
          opacity: 0.15;
          z-index: 1;
        }

        .role-badge {
          background: rgba(0, 229, 255, 0.1);
          color: var(--primary);
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 6px 16px;
          border-radius: 99px;
          border: 1px solid rgba(0, 229, 255, 0.2);
          display: inline-block;
          margin-bottom: 16px;
        }

        .user-name { font-size: 32px; font-weight: 800; margin-bottom: 8px; }
        .user-email { color: var(--muted); font-size: 16px; margin-bottom: 40px; }

        .identity-footer { width: 100%; margin-top: auto; }
        :global(.logout-btn) { width: 100% !important; justify-content: center !important; }

        .bento-info { padding: 40px; }
        .section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--muted); margin-bottom: 32px; letter-spacing: 0.1em; }
        
        .data-rows { display: flex; flex-direction: column; gap: 24px; }
        .data-row { display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .label { font-size: 11px; text-transform: uppercase; color: var(--muted); font-weight: 600; }
        .val { font-size: 15px; font-weight: 600; }
        .val-mono { font-family: monospace; font-size: 13px; color: rgba(255, 255, 255, 0.6); }
        .success { color: var(--success); }

        .bento-shortcut {
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          transition: var(--transition-smooth);
        }

        .bento-shortcut:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          background: rgba(0, 229, 255, 0.03);
        }

        .icon { font-size: 32px; }
        .shortcut-meta h4 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .shortcut-meta p { font-size: 13px; color: var(--muted); }

        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
          .bento-item-large { grid-row: span 1; }
        }
      `}</style>
    </div>
  );
}
