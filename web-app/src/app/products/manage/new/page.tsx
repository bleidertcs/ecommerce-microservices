'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductForm from '@/components/products/ProductForm';
import { ApiService } from '@/services/api.service';
import { useAuth } from '@/context/AuthContext';
import { CreateProductInput } from '@/types/product.types';

export default function NewProductPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace('/login');
    }
  }, [isAuthenticated, token, router]);

  const handleSubmit = async (data: CreateProductInput) => {
    if (!token) return;
    setSubmitting(true);
    try {
      await ApiService.createProduct(data, token);
      router.push('/products/manage');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 animate-fade-in text-foreground">
      <div className="mb-10">
        <Link
          href="/products/manage"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6 text-sm font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to management
        </Link>
        <h1 className="text-clamp-md font-heading font-extrabold tracking-tight mb-2">Add product</h1>
        <p className="text-muted text-sm">Create a new catalog entry with name, price, photo URLs, and more.</p>
      </div>

      <div className="glass-card p-8 rounded-[20px] border border-white/10">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/products/manage')}
          isSubmitting={submitting}
          submitLabel="Create product"
        />
      </div>
    </div>
  );
}
