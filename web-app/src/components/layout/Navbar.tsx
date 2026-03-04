'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { getCasdoorLoginUrl, getCasdoorSignupUrl } from '@/lib/casdoor-config';
import { useAuth } from '@/context/AuthContext';
import CartButton from './CartButton';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/" className="text-muted font-semibold text-[13px] uppercase tracking-[0.05em] transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Home</Link>
      <Link href="/products" className="text-muted font-semibold text-[13px] uppercase tracking-[0.05em] transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Products</Link>
      {isAuthenticated && <Link href="/products/manage" className="text-muted font-semibold text-[13px] uppercase tracking-[0.05em] transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Catalog</Link>}
      {isAuthenticated && <Link href="/orders" className="text-muted font-semibold text-[13px] uppercase tracking-[0.05em] transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Orders</Link>}
      {isAuthenticated && <Link href="/profile" className="text-muted font-semibold text-[13px] uppercase tracking-[0.05em] transition-colors hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Profile</Link>}
    </>
  );

  return (
    <nav className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] sm:w-[calc(100%-32px)] max-w-[1200px] min-h-14 h-auto sm:h-16 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-0 bg-black/60 backdrop-blur-[20px] border border-white/10 rounded-2xl z-[1000] shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <Link href="/" className="font-heading text-lg sm:text-xl font-extrabold text-foreground tracking-[0.1em]" onClick={() => setMobileMenuOpen(false)}>
        LUMINA
      </Link>
      
      <div className="hidden md:flex gap-4 lg:gap-6 bg-white/[0.03] px-4 lg:px-5 py-2 rounded-full border border-white/[0.05]">
        {navLinks}
      </div>

      <div className="flex gap-2 sm:gap-3 items-center">
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-muted hover:text-foreground hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        {isAuthenticated ? (
           <Link href="/logout" className="hidden sm:inline">
             <Button variant="secondary" size="sm">Logout</Button>
           </Link>
        ) : (
          <>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex" onClick={() => window.location.href = getCasdoorLoginUrl()}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex" onClick={() => window.location.href = getCasdoorSignupUrl()}>
              Register
            </Button>
          </>
        )}
        <CartButton />
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden w-full pt-4 mt-2 border-t border-white/10">
          <div className="flex flex-col gap-2 py-4">
            {navLinks}
            {isAuthenticated ? (
              <Link href="/logout" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-muted font-semibold text-[13px] uppercase tracking-[0.05em] hover:text-foreground py-2 block">Logout</span>
              </Link>
            ) : (
              <>
                <button type="button" onClick={() => { window.location.href = getCasdoorLoginUrl(); setMobileMenuOpen(false); }} className="text-left text-muted font-semibold text-[13px] uppercase tracking-[0.05em] hover:text-foreground py-2">
                  Sign In
                </button>
                <button type="button" onClick={() => { window.location.href = getCasdoorSignupUrl(); setMobileMenuOpen(false); }} className="text-left text-muted font-semibold text-[13px] uppercase tracking-[0.05em] hover:text-foreground py-2">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

