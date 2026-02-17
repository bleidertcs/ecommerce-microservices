'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function CallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const called = useRef(false);
  
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || called.current) {
      if (!code) setError('No authorization code found in URL');
      return;
    }

    called.current = true;

    async function exchangeCode() {
      try {
        const response = await fetch(`/api/auth/callback?code=${code}&state=${state}`);
        const data = await response.json();

        if (response.ok && data.token) {
          login(data.token);
        } else {
          setError(data.error || 'Failed to authenticate with Casdoor');
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('An unexpected error occurred during authentication');
      }
    }

    exchangeCode();
  }, [searchParams, login]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#ff4d4f' }}>Authentication Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => router.push('/')}
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '5px' }}
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ marginBottom: '20px' }}></div>
          <h2>Completing login...</h2>
          <p>Please wait while we finalize your session.</p>
        </div>
      )}
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="spinner" style={{ marginBottom: '20px' }}></div>
            <h2>Loading...</h2>
        </div>
    }>
        <CallbackContent />
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
