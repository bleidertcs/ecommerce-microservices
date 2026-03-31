"use client";

import React from 'react';
import Image from 'next/image';

type ProfileIdentityCardProps = {
  name: string;
  email: string;
  role: string;
  picture?: string;
};

export default function ProfileIdentityCard({
  name,
  email,
  role,
  picture,
}: ProfileIdentityCardProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="surface-card border border-border"
      style={{
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid pattern faint */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(0,112,243,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />

      <div className="flex items-center gap-6 sm:gap-8 flex-wrap" style={{ position: 'relative' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center overflow-hidden font-heading font-extrabold text-white border"
            style={{
              background: picture ? 'transparent' : 'linear-gradient(135deg, var(--color-primary), #0051d0)',
              borderColor: 'rgba(0,112,243,0.35)',
              boxShadow: '0 0 30px rgba(0,112,243,0.18)',
              fontSize: '32px',
            }}
          >
            {picture ? (
              <Image
                src={picture}
                alt={name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              initials
            )}
          </div>

          {/* Online dot */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid var(--background, #0a0a0e)',
              boxShadow: '0 0 8px rgba(34,197,94,0.6)',
            }}
          />
        </div>

        {/* Identity Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] border"
            style={{
              background: 'rgba(0,112,243,0.10)',
              borderColor: 'rgba(0,112,243,0.22)',
              color: 'var(--color-primary)',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
              }}
            />
            {role}
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-[28px] font-heading font-extrabold tracking-tight mb-1 leading-tight">
            {name}
          </h2>
          <p className="text-muted text-sm" style={{ marginBottom: 0 }}>
            {email}
          </p>
        </div>
      </div>
    </div>
  );
}
