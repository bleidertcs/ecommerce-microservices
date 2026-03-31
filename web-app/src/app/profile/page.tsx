"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProfileIdentityCard from '@/components/profile/ProfileIdentityCard';

type JwtPayload = {
  sub?: string;
  id?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  role?: string;
  picture?: string;
  iss?: string;
};

function parseJwt(token: string): JwtPayload | null {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

const StatCard = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <div className="surface-card p-5 sm:p-6 flex-1 min-w-0">
    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-muted mb-2">{label}</p>
    <p
      className="text-[18px] sm:text-[22px] font-heading font-extrabold leading-tight"
      style={accent ? { color: accent } : undefined}
    >
      {value}
    </p>
  </div>
);

const NavCard = ({
  href, icon, title, description, accent,
}: { href: string; icon: string; title: string; description: string; accent: string }) => (
  <Link href={href} className="block no-underline">
    <div className="nav-card surface-card p-5 sm:p-6 flex items-center gap-4 sm:gap-5 cursor-pointer">
      <div
        className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-[14px] flex items-center justify-center text-[20px] sm:text-[22px] flex-shrink-0"
        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14px] sm:text-[15px] mb-1 text-foreground truncate">{title}</p>
        <p className="text-[12px] sm:text-[13px] text-muted leading-relaxed">{description}</p>
      </div>
      <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ color: 'var(--muted)' }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
  </Link>
);

export default function ProfilePage() {
  const { token, isAuthenticated, logout } = useAuth();
  const hydrated = typeof window !== 'undefined';
  const decoded = token && hydrated ? parseJwt(token) : null;

  const user = decoded
    ? {
      id: decoded.sub || decoded.id || 'Unknown',
      name: decoded.name || decoded.preferred_username || 'Lumina Pilot',
      email: decoded.email || 'No email provided',
      role: decoded.role || 'admin',
      picture: decoded.picture,
      iss: decoded.iss,
    }
    : null;

  if (!hydrated) {
    return (
      <div className="container section-padding animate-fade-in">
        <div className="h-[360px] flex flex-col items-center justify-center gap-6">
          <div className="w-10 h-10 border-2 border-border border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted text-sm font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container section-padding animate-fade-in" style={{ textAlign: 'center' }}>
        <div className="surface-card border border-border" style={{ padding: '64px 40px', borderRadius: '24px' }}>
          <div className="text-5xl mb-6 opacity-40" aria-hidden="true">🔐</div>
          <h2 className="text-2xl sm:text-[26px] font-heading font-extrabold mb-3">
            Acceso restringido
          </h2>
          <p className="text-muted text-sm sm:text-[15px] leading-relaxed" style={{ marginBottom: '36px' }}>
            Esta sección está disponible solo para usuarios autenticados.
          </p>
          <Link href="/login" className="inline-block" style={{ textDecoration: 'none' }}>
            <Button variant="primary" glow>
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const memberSince = new Date().getFullYear();

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="mb-10 sm:mb-12 border-b border-border pb-6 sm:pb-8">
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-muted mb-2">
          Tu cuenta
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-extrabold tracking-tight leading-tight">
          Perfil
          </h1>

          <Button variant="danger" size="sm" onClick={logout} className="sm:self-auto self-start">
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Identity Card */}
      <ProfileIdentityCard
        name={user.name}
        email={user.email}
        role={user.role}
        picture={user.picture}
      />

      {/* Stat Strip */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        <StatCard label="Miembro desde" value={String(memberSince)} />
        <StatCard label="Estado de la cuenta" value="Activa" accent="#22c55e" />
        <StatCard label="Nivel de acceso" value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} accent="#067ff9" />
      </div>

      {/* Account Details Card */}
      <div className="surface-card" style={{ borderRadius: '20px', padding: '28px 28px', marginBottom: '20px' }}>
        <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-muted mb-6 flex items-center gap-2">
          <span style={{ width: 3, height: 14, background: 'var(--color-primary)', borderRadius: 2, display: 'inline-block' }}/>
          Detalles de la cuenta
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { label: 'Nombre visible', value: user.name, mono: false },
            { label: 'Correo electrónico', value: user.email, mono: false },
            { label: 'ID de usuario', value: user.id, mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 0',
              borderBottom: '1px solid var(--border)',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.1em] text-muted" style={{ flexShrink: 0 }}>
                {label}
              </span>
              <span style={{
                fontFamily: mono ? 'monospace' : undefined,
                fontSize: mono ? '12px' : '14px',
                fontWeight: mono ? 400 : 600,
                color: mono ? 'var(--muted)' : 'var(--foreground)',
                wordBreak: 'break-all',
                textAlign: 'right',
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Nav */}
      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-muted mb-3 flex items-center gap-2">
        <span style={{ width: 3, height: 14, background: 'var(--color-primary)', borderRadius: 2, display: 'inline-block' }}/>
        Accesos rápidos
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <NavCard href="/orders" icon="📦" title="Mis pedidos" description="Revisa y haz seguimiento de tus compras" accent="#067ff9" />
        <NavCard href="/cart" icon="🛒" title="Carrito" description="Consulta los artículos de tu carrito" accent="#a855f7" />
        <NavCard href="/products" icon="⚡" title="Explorar productos" description="Navega por el catálogo completo" accent="#22c55e" />
      </div>

      <style jsx>{`
        .nav-card:hover {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
