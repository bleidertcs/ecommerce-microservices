'use client';

import React, { useEffect } from 'react';
import { getCasdoorSignupUrl } from '@/lib/casdoor-config';

export default function RegisterPage() {
  useEffect(() => {
    window.location.href = getCasdoorSignupUrl();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner"></div>
      <h2 style={{ marginTop: '20px' }}>Redirecting to Casdoor Registration...</h2>
      <style jsx>{`
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
    </div>
  );
}
