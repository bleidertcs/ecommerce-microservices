"use client";

import React, { useEffect } from "react";
import { getCasdoorSignupUrl } from "@/lib/casdoor-config";

export default function RegisterPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
       window.location.href = getCasdoorSignupUrl();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="redirect-container animate-fade-in">
      <div className="glass-card redirect-card">
        <div className="spinner"></div>
        <h2 className="display-small" style={{ fontSize: '24px' }}>Joining Lumina Nexus</h2>
        <p className="text-muted">Preparing your premium membership registration...</p>
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
