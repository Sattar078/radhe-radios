import React from 'react';
import { MEDIA_MANIFEST } from '../utils/mediaManifest';
import { RevealOnScroll } from '../components/animation/RevealOnScroll';
import { GlassCard } from '../components/ui/GlassCard';
import { MapPin, Radio, CheckCircle2, Phone, ShieldCheck, Zap, Sparkles, Award, Cpu, Volume2, ArrowRight } from 'lucide-react';
import { Link } from '../router';
import { useLanguage } from '../context/LanguageContext';
import { STUDIO_CONFIG } from '../data/studioData';
import { VerifiedReviewsSection } from '../components/ui/VerifiedReviewsSection';

export function AboutPage() {
  const { t, isHindi } = useLanguage();

  return (
    <div className="w-full py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Page Header */}
        <RevealOnScroll className="max-w-4xl mb-16 md:mb-20">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F5F5F5] leading-[1.02] mb-6">
            HIGH-PERFORMANCE <br />
            <span className="text-gold-gradient">POWER AMPLIFIERS &amp; AUDIO</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {t.about.subheading}
          </p>
        </RevealOnScroll>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-24">
          {/* Photo Frame */}
          <div className="lg:col-span-6">
            <RevealOnScroll>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#111111]">
                <img
                  src={MEDIA_MANIFEST.keyframes.acousticEngineering}
                  alt="Radhe Radios Handcrafted Acoustic Engineering"
                  className="w-full h-full object-cover object-center brightness-95 contrast-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/80">
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-[#00e5ff]" />
                    <span>'CUSTOM POWER AMPLIFIERS & PRO AUDIO'</span>
                  </span>
                  <span className="text-[#00e5ff]">'KOTA, RAJASTHAN'</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Authentic Story Paragraphs */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <RevealOnScroll>
              <GlassCard className="p-8 sm:p-10 space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 text-[#00e5ff] text-xs font-mono uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>'Welcome to Radhe Radios'</span>
                </div>
                <h2 className="font-display text-2xl font-bold uppercase text-[#F5F5F5] mb-2 text-gold-gradient">
                  'Our Heritage & Journey'
                </h2>
                {t.about.paragraphs.map((p, idx) => (
                  <p key={idx} className={idx === t.about.paragraphs.length - 1 ? 'text-white font-medium border-l-2 border-[#00e5ff] pl-3' : 'font-normal'}>
                    {p}
                  </p>
                ))}
              </GlassCard>
            </RevealOnScroll>
          </div>
        </div>

        {/* Philosophy Highlight: Quality & Value (Paisa Vasool) */}
        <RevealOnScroll className="mb-24">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#12141C] via-[#0E1118] to-[#151922] border border-[#00e5ff]/30 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e5ff]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-3xl relative z-10">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00e5ff] block mb-3 font-semibold">
                'OUR PHILOSOPHY'
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white mb-4">
                'QUALITY & VALUE — '
                <span className="text-gold-gradient">'TRUE PAISA VASOOL'</span>
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal mb-6">
                'We believe in true paisa vasool—delivering top-tier audio quality that ensures every single rupee spent by our customers is completely worth it. Our products are engineered not just to sound extraordinary, but to last for years, providing unmatched durability and performance on every journey.'
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-[#00e5ff]">
                <span className="px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/25 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Value Guarantee
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/25 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Heavy-Duty Durability
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/25 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Thunderous Sound
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Feature Spotlight: Proudly Made in India: Advanced Power Amplifiers */}
        <RevealOnScroll className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0E1118] border border-[#00e5ff]/40 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] text-xs font-mono uppercase tracking-widest mb-4">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>'PROUDLY MADE IN INDIA'</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white mb-4">
                  'ADVANCED POWER AMPLIFIERS'
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal mb-4">
                  'At Radhe Radios, every single power amplifier is proudly Made in India, crafted with precision engineering and heavy-duty components designed to match global standards.'
                </p>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                  'Our circuit boards feature robust heatsinks, premium-grade capacitors, and advanced Class-A architecture to deliver ultra-clean sound, minimal distortion, and thunderous power output that lasts for years. When you choose Radhe Radios, you are investing in authentic Indian manufacturing built for heavy bass performance and absolute reliability.'
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/[0.08] text-center font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="block text-lg font-bold text-gold-gradient">Class-A</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Architecture</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="block text-lg font-bold text-gold-gradient">Heavy</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Heat Sinks</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="block text-lg font-bold text-gold-gradient">High-Cap</span>
                  <span className="text-[10px] text-zinc-400 uppercase">Capacitors</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="p-6 rounded-2xl bg-[#12141C] border border-white/10 hover:border-[#00e5ff]/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff]">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase text-white">
                    'Crystal-Clear Acoustics & Deep Bass'
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  'Designed for massive bass output without sound clipping, perfect for vehicle installations and pro venues.'
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#12141C] border border-white/10 hover:border-[#00e5ff]/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase text-white">
                    'Rugged Road-Ready Durability'
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  'Withstands rough transport, voltage fluctuations, and continuous all-night operations.'
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#12141C] border border-white/10 hover:border-[#00e5ff]/30 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-xl bg-[#00e5ff]/10 text-[#00e5ff]">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase text-white">
                    'Custom Built For Your Need'
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  'Tailored configurations to match your exact vehicle cabin, voltage profile, and acoustic taste.'
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Why Choose Us? 3 Pillars */}
        <RevealOnScroll className="mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00e5ff] block mb-3 font-semibold">
            'THE RADHE RADIOS ADVANTAGE'
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-[#F5F5F5]">
            {(
              <>WHY <span className="text-gold-gradient">CHOOSE US?</span></>
            )}
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {t.about.pillars.map((pillar, idx) => (
            <RevealOnScroll key={pillar.title} delay={idx * 100}>
              <GlassCard className="p-8 h-full flex flex-col justify-between" goldBorder>
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#00e5ff]/10 border border-[#00e5ff]/25 flex items-center justify-center text-[#00e5ff] mb-6 font-mono font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase text-[#F5F5F5] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/[0.06] text-[10px] font-mono uppercase text-[#00e5ff] font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>'Engineered Standard'</span>
                </div>
              </GlassCard>
            </RevealOnScroll>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 border-y border-white/[0.08] mb-24">
          {t.stats.map((stat, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100} className="flex flex-col">
              <span className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gold-gradient mb-2">
                {stat.value}
              </span>
              <span className="text-xs font-mono tracking-wider text-[#00e5ff] uppercase font-semibold">
                {stat.label}
              </span>
              <span className="text-[11px] font-sans text-zinc-400 mt-0.5">
                {stat.desc}
              </span>
            </RevealOnScroll>
          ))}
        </div>

        {/* Live Verified DJ Customer Reviews from Backend */}
        <div className="mb-24">
          <VerifiedReviewsSection />
        </div>

        {/* Get in Touch With Us Card */}
        <RevealOnScroll className="mb-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0E1118] border border-[#00e5ff]/30 text-center flex flex-col items-center">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#00e5ff] block mb-2 font-semibold">
              'GET IN TOUCH WITH US'
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white mb-3">
              'Radhe Radios Kota'
            </h2>
            <div className="flex items-center gap-2 text-zinc-300 text-sm mb-6 font-mono">
              <MapPin className="w-4 h-4 text-[#00e5ff]" />
              <span>{STUDIO_CONFIG.location}</span>
            </div>
            
            <p className="max-w-xl text-zinc-400 text-sm mb-8">
              'Whether you are looking to upgrade your vehicle audio setup or need powerful professional sound systems, Radhe Radios is your ultimate destination for quality and reliability.'
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${STUDIO_CONFIG.phones?.[0]?.number || STUDIO_CONFIG.phone || '+919887158522'}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#00e5ff] hover:bg-[#38bdf8] text-[#080808] font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              >
                <Phone className="w-4 h-4" />
                <span>Call: {STUDIO_CONFIG.phones?.[0]?.label || STUDIO_CONFIG.phone || '+91 98871 58522'}</span>
              </a>

              <a
                href={`tel:${STUDIO_CONFIG.phones?.[1]?.number || STUDIO_CONFIG.phoneSecondary || '+919509040057'}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[#00e5ff] font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4" />
                <span>Call: {STUDIO_CONFIG.phones?.[1]?.label || STUDIO_CONFIG.phoneSecondary || '+91 95090 40057'}</span>
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#00e5ff]/40 hover:bg-[#00e5ff]/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
              >
                <span>'Factory Inquiry Desk'</span>
                <ArrowRight className="w-4 h-4 text-[#00e5ff]" />
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
