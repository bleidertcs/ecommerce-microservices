'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProductForm from '@/components/products/ProductForm';
import { ApiService } from '@/services/api.service';
import { useAuth } from '@/context/AuthContext';
import { CreateProductInput } from '@/types/product.types';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialValues, setInitialValues] = useState<CreateProductInput | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace('/login');
      return;
    }
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const product = await ApiService.getProductById(id);
        if (cancelled) return;
        setInitialValues({
          name: product.name,
          description: product.description ?? undefined,
          price: product.price,
          stock: product.stock,
          category: product.category ?? undefined,
          brand: product.brand ?? undefined,
          sku: product.sku,
          images: product.images && product.images.length ? product.images : undefined,
          tags: product.tags,
          featured: product.featured,
        });
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isAuthenticated, token, router]);

  const handleSubmit = async (data: CreateProductInput) => {
    if (!token || !id) return;
    setSubmitting(true);
    try {
      await ApiService.updateProduct(id, data, token);
      router.push('/products/manage');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;
  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
        <p className="text-muted text-sm">Loading product...</p>
      </div>
    );
  }
  if (notFound || !initialValues) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-extrabold mb-6">Product not found</h1>
        <Link href="/products/manage" className="text-primary font-medium hover:underline">
          Back to management
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight mb-2">Edit product</h1>
        <p className="text-muted text-sm">Update name, price, photos, stock, and other details.</p>
      </div>

      <div className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-[20px] border border-white/10">
        <ProductForm
          defaultValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/products/manage')}
          isSubmitting={submitting}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
