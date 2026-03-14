'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useModal } from '@/context/ModalContext';

function CallbackContent() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showModal } = useModal();
  const [loading, setLoading] = useState(true);

  const called = useRef(false);
  
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || called.current) {
      if (!code) {
        showModal({
          type: 'error',
          title: 'Enlace Inválido',
          message: 'No se detectó el código de autorización necesario para el protocolo de seguridad.',
          confirmLabel: 'Regresar',
          onConfirm: () => router.push('/')
        });
      }
      return;
    }

    called.current = true;

    async function exchangeCode() {
      try {
        const response = await fetch(`/api/auth/callback?code=${code}&state=${state}`);
        const data = await response.json();

        if (response.ok && data.token) {
          login(data.token);
          // Redirect is handled by login logic or navigation
        } else {
          showModal({
            type: 'error',
            title: 'Fallo de Autenticación',
            message: data.error || 'La verificación con Lumina Core ha fallado.',
            confirmLabel: 'Reintentar',
            onConfirm: () => router.push('/login')
          });
        }
      } catch (err) {
        console.error('Auth error:', err);
        showModal({
          type: 'error',
          title: 'Interrupción del Sistema',
          message: 'Se produjo un error inesperado durante el intercambio de credenciales.',
          confirmLabel: 'Regresar',
          onConfirm: () => router.push('/')
        });
      } finally {
        setLoading(false);
      }
    }

    exchangeCode();
  }, [searchParams, login, showModal, router]);

  return (
    <div className="callback-container animate-fade-in">
      <div className="glass-card callback-card">
        <div className="spinner"></div>
        <h2 className="display-small" style={{ fontSize: '24px' }}>Finalizing Session</h2>
        <p className="text-muted">Configuring your premium nexus environment...</p>
      </div>
      <style jsx>{`
        .callback-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60vh;
        }
        .callback-card {
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
