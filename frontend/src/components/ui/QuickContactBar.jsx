import React from 'react';
import { Phone, MessageCircle, FileText } from 'lucide-react';
import { STUDIO_CONFIG } from '../../data/studioData';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function QuickContactBar() {
  const { openAuthModal } = useAuth();
  
  const whatsappUrl = `https://wa.me/${STUDIO_CONFIG.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    'Hello Radhe Radios Kota! I would like to inquire about custom power amplifiers and vehicle audio setups.'
  )}`;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md bg-[#000000]/95 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex items-center justify-between gap-2">
      {/* 1. Direct Phone Call Button */}
      <a
        href={`tel:${STUDIO_CONFIG.phone}`}
        className="flex-1 py-2.5 px-3 rounded-full bg-white hover:bg-zinc-200 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
      >
        <Phone className="w-3.5 h-3.5 fill-black" />
        <span className="font-sans font-extrabold">Call Desk</span>
      </a>

      {/* 2. Direct WhatsApp Button (Monochrome style) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 py-2.5 px-3 rounded-full bg-[#18181b] hover:bg-[#27272a] border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="font-sans font-bold">WhatsApp</span>
      </a>

      {/* 3. Quick Price List / Login */}
      <button
        type="button"
        onClick={() => openAuthModal('login')}
        className="py-2.5 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5 text-white" />
        <span className="font-sans font-bold">Catalog</span>
      </button>
    </div>
  );
}
