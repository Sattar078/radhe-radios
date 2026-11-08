import React from 'react';

/**
 * Reusable Glassmorphism card adhering to the clean black & white monochrome theme.
 */
export function GlassCard({
  children,
  className = '',
  elevated = false,
  goldBorder = false,
  sonicBorder = false,
  as: Component = 'div',
  ...props
}) {
  const baseClasses = 'relative rounded-3xl backdrop-blur-2xl transition-all duration-300';
  const surfaceClasses = elevated
    ? 'bg-[#121215]/85 border border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.18)]'
    : 'bg-[#0a0a0c]/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.12)]';
  const borderHighlight = (goldBorder || sonicBorder)
    ? 'border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,229,255,0.25)]'
    : 'hover:border-white/25';

  return (
    <Component
      className={`${baseClasses} ${surfaceClasses} ${borderHighlight} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
