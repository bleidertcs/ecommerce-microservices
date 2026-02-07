'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        LUMINA
      </Link>
      
      <div className={styles.navLinks}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/products" className={styles.link}>Products</Link>
        {isAuthenticated && <Link href="/orders" className={styles.link}>Orders</Link>}
      </div>

      <div className={styles.actions}>
        {isAuthenticated ? (
           <Button variant="secondary" onClick={logout}>
             Logout
           </Button>
        ) : (
          <Link href="/login">
            <Button variant="secondary">
              Sign In
            </Button>
          </Link>
        )}
        <Button variant="primary">
          Cart (0)
        </Button>
      </div>
    </nav>
  );
}
