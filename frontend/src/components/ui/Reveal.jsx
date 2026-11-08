import React, { useEffect, useRef, useState } from 'react';

/**
 * Presentation-style Reveal Component
 * Orchestrates restrained, hierarchical entry animations for headings,
 * paragraphs, cards, statistics, and interactive buttons without layout shift.
 */
export function Reveal({
  children,
  type = 'default',
  delay = 0,
  staggerIndex = 0,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(() => {
    if (typeof window !== 'undefined') {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      const noObserver = !('IntersectionObserver' in window);
      return Boolean(reducedMotion || noObserver);
    }
    return false;
  });

  // Compute restrained delay based on visual hierarchy role
  let calculatedDelay = delay;
  if (calculatedDelay === 0) {
    switch (type) {
      case 'eyebrow':
        calculatedDelay = 0;
        break;
      case 'heading':
        calculatedDelay = 80;
        break;
      case 'subheading':
        calculatedDelay = 140;
        break;
      case 'paragraph':
        calculatedDelay = 200;
        break;
      case 'button':
        calculatedDelay = 280 + staggerIndex * 60;
        break;
      case 'card':
        calculatedDelay = 120 + staggerIndex * 80;
        break;
      case 'stat':
        calculatedDelay = 100 + staggerIndex * 70;
        break;
      case 'image':
        calculatedDelay = 160;
        break;
      default:
        calculatedDelay = staggerIndex * 60;
    }
  }

  useEffect(() => {
    if (isRevealed) return;
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isRevealed]);

  return (
    <Component
      ref={ref}
      style={{
        transitionDelay: `${calculatedDelay}ms`,
      }}
      className={`reveal-init ${isRevealed ? 'reveal-visible' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
