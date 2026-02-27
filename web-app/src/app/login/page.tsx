"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getCasdoorLoginUrl } from "@/lib/casdoor-config";

function LoginRedirect() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Artificial small delay for premium feels
    const timer = setTimeout(() => {
       window.location.href = getCasdoorLoginUrl();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="redirect-container animate-fade-in">
      <div className="glass-card redirect-card">
        <div className="spinner"></div>
        <h2 className="display-small" style={{ fontSize: '24px' }}>Securing Connection</h2>
        <p className="text-muted">Establishing link with Lumina Core...</p>
      </div>
      <style jsx>{`
        .redirect-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
        }
        .redirect-card {
           padding: 60px;
           text-align: center;
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 24px;
        }
        .spinner {
          width: 48px;
          height: 48px;
          border: 2px solid rgba(255, 255, 255, 0.05);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container section-padding" style={{ textAlign: 'center' }}>Initialising...</div>}>
      <LoginRedirect />
    </Suspense>
  );
}
