import React from 'react';
import { Link } from '../router';
import { Radio, ArrowLeft } from 'lucide-react';
import { STUDIO_CONFIG } from '../data/studioData';

export function NotFoundPage() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="w-16 h-16 rounded-full border border-[#00e5ff]/40 bg-[#00e5ff]/10 flex items-center justify-center text-[#00e5ff] mb-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
        <Radio className="w-8 h-8" />
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00e5ff] mb-2">
        ERROR 404 &bull; FREQUENCY UNTUNED
      </span>

      <h1 className="font-display text-4xl sm:text-6xl font-black uppercase text-[#F5F5F5] mb-4">
        Signal Lost in Space
      </h1>

      <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed mb-8">
        The requested acoustic channel or page cannot be reached. Return to the {STUDIO_CONFIG.brandName} home frequency.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Main Experience</span>
      </Link>
    </div>
  );
}
