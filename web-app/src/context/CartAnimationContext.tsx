'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

interface CartAnimation {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  imageUrl?: string;
  /** Whether the animation has been triggered (moved from start → end) */
  active: boolean;
}

interface CartAnimationContextType {
  triggerCartAnimation: (startX: number, startY: number, imageUrl?: string) => void;
}

const CartAnimationContext = createContext<CartAnimationContextType | undefined>(undefined);

export function useCartAnimation() {
  const context = useContext(CartAnimationContext);
  if (!context) {
    throw new Error('useCartAnimation must be used within a CartAnimationProvider');
  }
  return context;
}

/** A single flying dot/image from product to cart icon */
function FlyingItem({ anim }: { anim: CartAnimation }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Phase 1: element is in DOM at startX/startY with no transform
    // Phase 2: next rAF fires the transition to endX/endY
    const raf = requestAnimationFrame(() => {
      setActive(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const dx = anim.endX - anim.startX;
  const dy = anim.endY - anim.startY;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${anim.startX}px`,
        top: `${anim.startY}px`,
        width: '56px',
        height: '56px',
        marginLeft: '-28px',
        marginTop: '-28px',
        borderRadius: '50%',
        overflow: 'hidden',
        zIndex: 9999,
        boxShadow: '0 0 24px rgba(0, 112, 243, 0.8)',
        border: '2px solid rgba(0, 112, 243, 0.6)',
        backgroundColor: anim.imageUrl ? 'black' : '#0070f3',
        transform: active
          ? `translate(${dx}px, ${dy}px) scale(0.15)`
          : 'translate(0, 0) scale(1)',
        opacity: active ? 0 : 1,
        transition: active
          ? 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.75s ease-in'
          : 'none',
        pointerEvents: 'none',
      }}
    >
      {anim.imageUrl && (
        <img
          src={anim.imageUrl}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}

export function CartAnimationProvider({ children }: { children: ReactNode }) {
  const [animations, setAnimations] = useState<CartAnimation[]>([]);
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const triggerCartAnimation = useCallback(
    (startX: number, startY: number, imageUrl?: string) => {
      const cartIcon = document.getElementById('global-cart-icon');
      let endX = window.innerWidth - 60;
      let endY = 30;

      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect();
        endX = rect.left + rect.width / 2;
        endY = rect.top + rect.height / 2;
      }

      const id = ++idRef.current;
      const newAnim: CartAnimation = { id, startX, startY, endX, endY, imageUrl, active: false };
      setAnimations((prev) => [...prev, newAnim]);

      // Remove after animation duration (750ms) + a little buffer
      setTimeout(() => {
        setAnimations((prev) => prev.filter((a) => a.id !== id));
      }, 900);
    },
    []
  );

  return (
    <CartAnimationContext.Provider value={{ triggerCartAnimation }}>
      {children}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <>
            {animations.map((anim) => (
              <FlyingItem key={anim.id} anim={anim} />
            ))}
          </>,
          document.body
        )}
    </CartAnimationContext.Provider>
  );
}
