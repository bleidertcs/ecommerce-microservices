'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getCasdoorLoginUrl } from '@/lib/casdoor-config';
import { useAuth } from '@/context/AuthContext';
import CartButton from '@/components/layout/CartButton';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/products" className="text-foreground font-semibold text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-muted" onClick={() => setMobileMenuOpen(false)}>Products</Link>
      <Link href="/solutions" className="text-foreground font-semibold text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-muted" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
      <Link href="/support" className="text-foreground font-semibold text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-muted" onClick={() => setMobileMenuOpen(false)}>Support</Link>
      <Link href="/company" className="text-foreground font-semibold text-[11px] uppercase tracking-[0.1em] transition-colors hover:text-muted" onClick={() => setMobileMenuOpen(false)}>Company</Link>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full min-h-16 h-auto flex flex-wrap items-center justify-between gap-2 px-6 sm:px-10 py-3 sm:py-0 bg-background/90 backdrop-blur-md border-b border-border z-[1000] transition-all duration-300">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-heading" onClick={() => setMobileMenuOpen(false)}>
        <div className="flex gap-0.5 items-end h-[18px] pb-0.5">
            <div className="w-[3px] bg-foreground h-1.5"></div>
            <div className="w-[3px] bg-foreground h-2.5"></div>
            <div className="w-[3px] bg-foreground h-3.5"></div>
            <div className="w-[3px] bg-foreground h-[18px]"></div>
        </div>
        <div className="flex flex-col leading-none">
            <span className="text-[13px] font-extrabold tracking-[0.1em] text-foreground">MONOLITH</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-muted">TECH</span>
        </div>
      </Link>
      
      {/* Center Links */}
      <div className="hidden md:flex flex-1 justify-center gap-6 lg:gap-10">
        {navLinks}
      </div>

      {/* Right Icons */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* Search */}
        <div className="hidden md:flex items-center bg-surface-elevated border border-border rounded-full px-3 py-1.5 mr-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted mr-2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search" className="bg-transparent text-[11px] font-semibold outline-none w-20 text-foreground placeholder-muted" />
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        <CartButton />

        {isAuthenticated ? (
            <Link href="/profile" className="text-foreground hover:text-muted transition-colors flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </Link>
        ) : (
            <button onClick={() => window.location.href = getCasdoorLoginUrl()} className="text-foreground hover:text-muted transition-colors flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </button>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden w-full pt-4 mt-2 border-t border-border">
          <div className="flex flex-col gap-2 py-4">
            {navLinks}
            {isAuthenticated ? (
              <Link href="/logout" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-foreground font-semibold text-[11px] uppercase tracking-[0.1em] hover:text-muted py-2 block">Logout</span>
              </Link>
            ) : (
              <button type="button" onClick={() => { window.location.href = getCasdoorLoginUrl(); setMobileMenuOpen(false); }} className="text-left text-foreground font-semibold text-[11px] uppercase tracking-[0.1em] hover:text-muted py-2">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

