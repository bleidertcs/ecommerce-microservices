'use client';

import React, { Suspense } from 'react';
import CallbackScreen from './CallbackScreen';

export default function Page() {
  return (
    <Suspense fallback={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="spinner" style={{ marginBottom: '20px' }}></div>
            <h2>Loading...</h2>
        </div>
    }>
        <CallbackScreen />
        <style jsx global>{`
            .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #000;
            animation: spin 1s linear infinite;
            }
            @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
            }
        `}</style>
    </Suspense>
  );
}
