'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import { getCasdoorLoginUrl, getCasdoorSignupUrl } from '@/lib/casdoor-config';
import { useAuth } from '@/context/AuthContext';
import CartButton from './CartButton';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        LUMINA
      </Link>
      
      <div className={styles.navLinks}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/products" className={styles.link}>Products</Link>
        {isAuthenticated && <Link href="/orders" className={styles.link}>Orders</Link>}
        {isAuthenticated && <Link href="/profile" className={styles.link}>Profile</Link>}
      </div>

      <div className={styles.actions}>
        {isAuthenticated ? (
           <Link href="/logout">
             <Button variant="secondary">
               Logout
             </Button>
           </Link>
        ) : (
          <>
            <Button variant="secondary" onClick={() => {
              window.location.href = getCasdoorLoginUrl();
            }}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => {
              window.location.href = getCasdoorSignupUrl();
            }}>
              Register
            </Button>
          </>
        )}
        <CartButton />
      </div>
    </nav>
  );
}
