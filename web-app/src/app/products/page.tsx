import React, { Suspense } from 'react';
import ProductsScreen from './ProductsScreen';

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="h-[400px] flex flex-col items-center justify-center gap-6">
                    <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin"></div>
                    <p className="text-muted text-sm font-medium">Initializing...</p>
                </div>
            }
        >
            <ProductsScreen />
        </Suspense>
    );
}
