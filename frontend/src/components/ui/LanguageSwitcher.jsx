import React from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ variant = 'navbar', className = '' }) {
  if (variant === 'compact') {
    return (
      <div
        className={`relative group inline-flex items-center px-2.5 py-1.5 rounded-xl bg-black/50 hover:bg-zinc-900/80 border border-white/10 hover:border-cyan-400/40 text-xs font-mono font-bold text-zinc-300 hover:text-cyan-100 transition-all duration-300 overflow-hidden shadow-sm cursor-pointer ${className}`}
        title="Language: English"
      >
        {/* Overhead Lamp */}
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
          <div className="w-6 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
          <div className="w-14 h-8 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
        </div>
        <Globe className="w-3 h-3 text-zinc-400 group-hover:text-cyan-300 mr-1.5 transition-colors" />
        <span className="relative z-10">EN</span>
      </div>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`relative group flex items-center justify-between p-3 rounded-2xl bg-black/60 border border-white/10 hover:border-cyan-400/40 transition-all overflow-hidden ${className}`}>
        {/* Overhead Lamp */}
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
          <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_10px_2px_#00e5ff]" />
          <div className="w-24 h-10 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.4)_0%,_transparent_70%)] blur-[0.5px]" />
        </div>
        <div className="flex items-center gap-2 text-xs text-white font-semibold relative z-10">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Language:</span>
        </div>
        <span className="relative z-10 px-3 py-1 rounded-full bg-zinc-900 border border-cyan-400/30 text-cyan-200 text-xs font-bold font-mono shadow-sm">
          English (EN)
        </span>
      </div>
    );
  }

  // Default: Elegant Navbar Lamp Button
  return (
    <button
      type="button"
      className={`relative group inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/40 hover:bg-zinc-900/80 border border-white/10 hover:border-cyan-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
      title="Language: English"
      aria-label="Language: English"
    >
      {/* Overhead Lamp Fixture & Downward Light Beam */}
      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center">
        <div className="w-7 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_10px_2px_#00e5ff,0_0_18px_3px_rgba(239,68,68,0.7)]" />
        <div className="w-16 h-9 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.45)_0%,_rgba(239,68,68,0.12)_55%,_transparent_75%)] blur-[0.5px]" />
      </div>

      <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-300 transition-colors relative z-10" />
      <span className="text-[11px] font-mono tracking-wider font-bold text-zinc-300 group-hover:text-cyan-100 transition-colors relative z-10">
        EN
      </span>
    </button>
  );
}
