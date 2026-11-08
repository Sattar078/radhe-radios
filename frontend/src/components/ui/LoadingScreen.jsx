import React from 'react';
import { STUDIO_CONFIG } from '../../data/studioData';

export function LoadingScreen({ message = 'INITIALIZING AUDIO ARCHITECTURE', progress }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] px-6 text-center select-none"
    >
      {/* Brand Logo (Radhe Radios SVG) */}
      <div className="mb-6 flex items-center justify-center">
        <img
          src="/radhe radios logo.svg"
          alt="Radhe Radios Logo"
          className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,229,255,0.6)] animate-pulse"
        />
      </div>

      {/* Brand Title */}
      <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-[0.25em] text-[#F5F5F5] mb-2">
        {STUDIO_CONFIG.brandName}
      </h2>
      <p className="font-mono text-[11px] tracking-widest text-cyan-300 uppercase mb-8">
        Kota, Rajasthan &bull; Estd. 2018
      </p>

      {/* Progress Bar or Spinner (Logo Theme) */}
      <div className="w-48 md:w-64 h-[2.5px] bg-white/10 rounded-full overflow-hidden relative mb-3">
        {progress !== undefined ? (
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-red-500 shadow-[0_0_12px_#00e5ff] transition-all duration-100 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        ) : (
          <div className="h-full w-1/3 bg-gradient-to-r from-cyan-400 to-red-500 animate-[shimmer_1.5s_infinite_linear]" />
        )}
      </div>

      <div className="flex items-center justify-between w-48 md:w-64 text-[10px] font-mono text-[#A1A1AA]">
        <span>{message}</span>
        {progress !== undefined && <span className="text-cyan-400 font-bold">{Math.round(progress)}%</span>}
      </div>
    </div>
  );
}
