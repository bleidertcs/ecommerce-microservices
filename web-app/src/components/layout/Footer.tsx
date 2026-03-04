"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 border-t border-border mt-16 sm:mt-20 lg:mt-[100px] bg-gradient-to-b from-transparent to-[rgba(0,229,255,0.02)] animate-fade-in">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 sm:gap-12 lg:gap-[60px] mb-12 sm:mb-16 lg:mb-20">
                    <div className="footer-brand">
                        <Link
                            href="/"
                            className="font-heading text-2xl font-extrabold tracking-[0.2em] text-foreground mb-6 block"
                        >
                            LUMINA
                        </Link>
                        <p className="text-muted text-[15px] leading-relaxed max-w-[320px]">
                            The next generation of tech acquisitions. Precision engineered for the
                            elite.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:gap-8">
                        <div className="link-group">
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground mb-6">
                                Showcase
                            </h4>
                            <Link
                                href="/products"
                                className="block text-muted text-sm mb-3 transition-all hover:text-primary hover:translate-x-1"
                            >
                                All Products
                            </Link>
                            <Link
                                href="/products?category=Electronics"
                                className="block text-muted text-sm mb-3 transition-all hover:text-primary hover:translate-x-1"
                            >
                                Electronics
                            </Link>
                            <Link
                                href="/products?category=Automotive"
                                className="block text-muted text-sm mb-3 transition-all hover:text-primary hover:translate-x-1"
                            >
                                Automotive
                            </Link>
                        </div>

                        <div className="link-group">
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground mb-6">
                                Nexus
                            </h4>
                            <Link
                                href="/profile"
                                className="block text-muted text-sm mb-3 transition-all hover:text-primary hover:translate-x-1"
                            >
                                Identity
                            </Link>
                            <Link
                                href="/orders"
                                className="block text-muted text-sm mb-3 transition-all hover:text-primary hover:translate-x-1"
                            >
                                Acquisitions
                            </Link>
                            <Link
                                href="/cart"
                                className="block text-muted text-sm mb-3 transition-all hover:text-primary hover:translate-x-1"
                            >
                                Vessel
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-8 sm:pt-10 border-t border-white/5 text-muted text-xs sm:text-[13px] text-center sm:text-left">
                    <p>&copy; {new Date().getFullYear()} LUMINA CORE. All rights reserved.</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_10px_var(--color-success)]"></span>
                        System Online
                    </div>
                </div>
            </div>
        </footer>
    );
}

