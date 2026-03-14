'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';

import { API_BASE_URL } from '@/lib/config';

export default function ProductActions({
    productId,
    price,
    productName,
    productImage,
}: {
    productId: string;
    price: number;
    productName?: string;
    productImage?: string;
}) {
    const { token, isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const { success, error: toastError } = useToast();
    const { showModal } = useModal();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            id: productId,
            name: productName || 'Product',
            price: price,
            image: productImage,
        });
        setAdded(true);
        success(`${productName || 'Producto'} añadido al carrito`);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                items: [{ productId, quantity: 1, price }],
                shippingAddress: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA',
                    recipientName: 'Demo User',
                    recipientPhone: '+1234567890',
                },
                paymentMethod: 'Credit Card',
            };

            const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                showModal({
                    type: 'error',
                    title: 'Fallo en Adquisición',
                    message: err.message || 'No se pudo procesar la orden directa.',
                });
                return;
            }

            const data = await res.json();
            showModal({
                type: 'success',
                title: 'Transferencia Exitosa',
                message: `El artefacto ha sido adquirido. ID de Orden: ${data.id}`,
                confirmLabel: 'Ver mis órdenes',
                onConfirm: () => router.push('/orders'),
            });
        } catch (err: any) {
            console.error(err);
            showModal({
                type: 'error',
                title: 'Error de Sistema',
                message: 'La secuencia de compra ha sido interrumpida inesperadamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2.5 w-full">
            <Button
                variant="primary"
                glow
                className="w-full justify-center"
                onClick={handleBuyNow}
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Buy Now'}
            </Button>
            <Button
                variant={added ? 'secondary' : 'glass'}
                className={`w-full justify-center transition-all duration-300 ${
                    added ? 'bg-success/10 text-success border-success' : ''
                }`}
                onClick={handleAddToCart}
            >
                {added ? '✓ Added' : 'Add to Cart'}
            </Button>
        </div>
    );
}

