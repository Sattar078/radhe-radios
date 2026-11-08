import React from 'react';
import { Reveal } from '../components/ui/Reveal';
import { Disc3, Speaker, Home, Truck, Check, ArrowRight, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { Link } from '../router';
import { useLanguage } from '../context/LanguageContext';

const ICONS = {
  'dj-sound-systems': Disc3,
  'premium-speakers': Speaker,
  'home-audio': Home,
  'nationwide-dealership': Truck,
};

export function ServicesPage() {
  const { t, isHindi } = useLanguage();

  return (
    <div className="w-full py-16 md:py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Page Header */}
        <div className="max-w-4xl mb-16 md:mb-20 space-y-4">
          <Reveal type="heading">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F5F5F5] leading-[1.02]">
              {isHindi ? (
                <>CUSTOM AUDIO ENGINEERING & <br /><span className="text-zinc-400">AMPLIFIER CAPABILITIES</span></>
              ) : (
                <>SOUND SYSTEM FABRICATION &amp; <br /><span className="text-gold-gradient">ACOUSTIC SERVICES</span></>
              )}
            </h1>
          </Reveal>

          <Reveal type="paragraph">
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              {isHindi
                ? 'From heavy-duty vehicle sound systems to Made in India power amplifiers and full concert rigs — Radhe Radios Kota delivers true value audio.'
                : 'From concert-scale dual subwoofer rigs to high-clarity home audio and nationwide factory wholesale supply, Radhe Studio delivers sound systems backed by 35+ years of Rajasthan craftsmanship.'}
            </p>
          </Reveal>
        </div>

        {/* 4 Core Disciplines In-Depth Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {t.services.map((service, idx) => {
            const Icon = ICONS[service.id] || Speaker;
            return (
              <Reveal
                key={service.id}
                type="card"
                staggerIndex={idx}
                className="p-8 sm:p-10 rounded-3xl bg-[#0E1118] border border-white/[0.08] hover:border-[#00e5ff]/40 transition-all flex flex-col justify-between shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-4 rounded-2xl bg-[#00e5ff]/10 text-[#00e5ff]">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-xs text-[#00e5ff] font-semibold px-3 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30">
                      {service.accentTag}
                    </span>
                  </div>

                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest block mb-2 font-semibold">
                    DISCIPLINE 0{idx + 1}
                  </span>

                  <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F5F5F5] mb-4">
                    {service.title}
                  </h2>

                  <p className="text-sm text-zinc-300 leading-relaxed mb-8 font-normal">
                    {service.description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-white/[0.08]">
                    <div className="font-mono text-xs uppercase tracking-wider text-[#00e5ff] font-bold">
                      'Key Deliverables & Specifications:'
                    </div>
                    {service.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-200">
                        <Check className="w-4 h-4 text-[#00e5ff] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-400 uppercase font-semibold">
                    'Certified in Kota Workshop'
                  </span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00e5ff] hover:text-[#38bdf8] transition-colors"
                  >
                    <span>Get Factory Price</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Manufacturing & Craft Capabilities Strip */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0E1118]/80 border border-white/[0.08] mb-24">
          <Reveal type="heading">
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-[#F5F5F5] mb-4">
              'FACTORY FABRICATION PROTOCOLS'
            </h2>
          </Reveal>
          <Reveal type="paragraph">
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl mb-10 font-normal">
              {isHindi
                ? 'We make zero compromises on components. Circuit boards, heatsinks, and heavy sub-bass enclosures are calibrated for thermal efficiency and road vibration resistance.'
                : 'We never cut corners on raw materials. Every wooden enclosure is precision-calculated for internal acoustic waves and sealed against rattles.'}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Reveal type="card" staggerIndex={0} className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <Layers className="w-6 h-6 text-[#00e5ff]" />
              <h3 className="font-display text-base font-bold uppercase text-white">
                '18mm Waterproof Birch Plywood'
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                'High-density multi-ply timber prevents cabinet rattling during heavy sub-bass.'
              </p>
            </Reveal>

            <Reveal type="card" staggerIndex={1} className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <Zap className="w-6 h-6 text-[#00e5ff]" />
              <h3 className="font-display text-base font-bold uppercase text-white">
                'Pure Copper Voice Coils'
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                'High-temperature pure copper voice coils withstand continuous thermal loads on touring stages.'
              </p>
            </Reveal>

            <Reveal type="card" staggerIndex={2} className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#00e5ff]" />
              <h3 className="font-display text-base font-bold uppercase text-white">
                '100% SPL Stress Tested'
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                'Every unit runs through prolonged frequency sweeps at maximum volume before dispatch.'
              </p>
            </Reveal>
          </div>
        </div>

        {/* CTA Banner */}
        <Reveal type="card" className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#12141C] via-[#1A1812] to-[#12141C] border border-[#00e5ff]/35 text-center space-y-6 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#F5F5F5]">
            'Need a Custom Sound System for Your Vehicle or Event?'
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto font-normal">
            {isHindi
              ? 'Contact our Transport Nagar, Kota workshop desk directly to specify your wattage and get factory pricing.'
              : 'Connect directly with our sound workshop in Bundi, Rajasthan, to calculate wattage requirements and cabinet setups.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)] cursor-pointer"
            >
              'Contact Factory Desk'
            </Link>
            <Link
              to="/products"
              className="px-8 py-3.5 rounded-full border border-white/20 hover:border-[#00e5ff] text-xs font-mono uppercase tracking-wider text-white hover:text-[#00e5ff] transition-all cursor-pointer"
            >
              'Browse Hardware Catalogue'
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
