"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-premium animate-fade-in">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">LUMINA</Link>
            <p className="description">
              The next generation of tech acquisitions. Precision engineered for the elite.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4 className='mb-2'>Showcase</h4>
              <Link href="/products">All Products</Link>
           
              <Link href="/products?category=Electronics">Electronics</Link>

              <Link href="/products?category=Automotive">Automotive</Link>
            </div>
            
            <div className="link-group">
              <h4 className='mb-2'>Nexus</h4>
              <Link href="/profile">Identity</Link>
              <Link href="/orders">Acquisitions</Link>
              <Link href="/cart">Vessel</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LUMINA CORE. All rights reserved.</p>
          <div className="status-indicator">
            <span className="dot"></span>
            System Online
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-premium {
          padding: 80px 0 40px;
          border-top: 1px solid var(--border);
          margin-top: 100px;
          background: linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.02));
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .logo {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: var(--foreground);
          margin-bottom: 24px;
          display: block;
        }

        .description {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.6;
          max-width: 320px;
        }

        .footer-links {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .link-group h4 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--foreground);
          margin-bottom: 24px;
        }

        .link-group a {
          display: block;
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 12px;
          transition: 0.3s;
        }

        .link-group a:hover {
          color: var(--primary);
          transform: translateX(4px);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--muted);
          font-size: 13px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 10px var(--success);
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </footer>
  );
}
