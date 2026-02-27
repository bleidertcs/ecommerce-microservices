"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Logout page that handles session cleanup without redirecting to Casdoor's API endpoint.
 * 
 * Instead of calling Casdoor's /api/logout (which returns JSON), we:
 * 1. Clear the local token from localStorage
 * 2. Show a premium logout animation
 * 3. Redirect the user back to the homepage
 */
export default function LogoutPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'clearing' | 'done'>('clearing');

  useEffect(() => {
    // Clear the local session immediately
    localStorage.removeItem('lumina_token');

    // Show "clearing" phase briefly, then transition to "done"
    const doneTimer = setTimeout(() => {
      setPhase('done');
    }, 800);

    // Redirect to home after the animation completes
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => {
      clearTimeout(doneTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="logout-container">
      <div className="logout-content animate-fade-in">
        <div className="nebula-spinner">
          <div className="spinner-core"></div>
        </div>
        <h1 className="logout-title">
          {phase === 'clearing' ? 'Securing Terminal' : 'Session Closed'}
        </h1>
        <p className="logout-status">
          {phase === 'clearing'
            ? 'Terminating Lumina link safely...'
            : 'Redirecting to home...'}
        </p>
      </div>

      <style jsx>{`
        .logout-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%);
          color: white;
        }

        .logout-content {
          text-align: center;
        }

        .nebula-spinner {
          width: 80px;
          height: 80px;
          margin: 0 auto 32px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nebula-spinner::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid rgba(0, 229, 255, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-core {
          width: 20px;
          height: 20px;
          background: var(--primary);
          border-radius: 50%;
          filter: blur(8px);
          animation: pulse 2s ease-in-out infinite;
        }

        .logout-title {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
          font-family: var(--font-heading);
        }

        .logout-status {
          color: var(--muted);
          font-size: 14px;
          font-weight: 500;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
