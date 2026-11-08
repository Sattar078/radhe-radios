import React from 'react';

/**
 * Reusable wrapper providing smooth entrance transitions across pages.
 */
export function PageTransition({ children, className = '' }) {
  return (
    <div className={`w-full animate-in fade-in duration-500 fill-mode-both ${className}`}>
      {children}
    </div>
  );
}
