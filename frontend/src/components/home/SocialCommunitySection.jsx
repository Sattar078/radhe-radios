import React from 'react';
import { RevealOnScroll } from '../animation/RevealOnScroll';
import { STUDIO_CONFIG, SOCIAL_LINKS } from '../../data/studioData';
import { InstagramIcon, FacebookIcon, YoutubeIcon, GoogleMapsIcon, WhatsAppIcon } from '../ui/SocialIcons';
import { ShieldCheck, CheckCircle2, Navigation, Radio, Award, Sparkles, ExternalLink } from 'lucide-react';

export function SocialCommunitySection() {
  return (
    <section className="w-full py-16 sm:py-24 bg-[#050507] border-t border-white/[0.08] relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#00e5ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL SOCIAL MEDIA &amp; COMMUNITY</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-4">
            CONNECT WITH <span className="text-sonic-gradient">RADHE RADIOS</span>
          </h2>

          <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Watch our daily heavy-bass speaker demonstrations, custom power amplifier builds, and real sound tests on Instagram, YouTube, and Facebook.
          </p>
        </RevealOnScroll>

        {/* 4 Social Cards (Instagram, YouTube, Facebook, Google Maps) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {/* 1. Instagram */}
          <RevealOnScroll delay={50}>
            <a
              href={STUDIO_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#140b18]/80 to-[#0c0810]/95 border border-pink-500/30 hover:border-pink-500/70 shadow-[0_10px_30px_rgba(236,72,153,0.1)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.25)] transition-all group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                    <InstagramIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30 font-bold uppercase">
                    Daily Reels
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold uppercase text-white mb-1">
                  Instagram
                </h3>
                <p className="text-xs font-mono text-pink-400 mb-3 font-semibold">
                  {STUDIO_CONFIG.instagramHandle}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                  Follow for daily 4K speaker reveals, subwoofer displacement tests, and behind-the-scenes workshop stories.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-pink-300 font-bold group-hover:text-white transition-colors">
                <span>Open Instagram</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </RevealOnScroll>

          {/* 2. YouTube */}
          <RevealOnScroll delay={100}>
            <a
              href={STUDIO_CONFIG.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#18090a]/80 to-[#0d0506]/95 border border-red-500/30 hover:border-red-500/70 shadow-[0_10px_30px_rgba(239,68,68,0.1)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.25)] transition-all group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
                    <YoutubeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 font-bold uppercase">
                    Sound Demos
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold uppercase text-white mb-1">
                  YouTube
                </h3>
                <p className="text-xs font-mono text-red-400 mb-3 font-semibold">
                  Radhe Radios Kota
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                  Experience full acoustic frequency sweeps, live DJ roadshow setups, and heavy-power amplifier reviews.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-red-300 font-bold group-hover:text-white transition-colors">
                <span>Watch on YouTube</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </RevealOnScroll>

          {/* 3. Facebook */}
          <RevealOnScroll delay={150}>
            <a
              href={STUDIO_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#09111c]/80 to-[#050910]/95 border border-blue-500/30 hover:border-blue-500/70 shadow-[0_10px_30px_rgba(59,130,246,0.1)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.25)] transition-all group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                    <FacebookIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-bold uppercase">
                    Community
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold uppercase text-white mb-1">
                  Facebook
                </h3>
                <p className="text-xs font-mono text-blue-400 mb-3 font-semibold">
                  Radhe Radios Official
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                  Join our verified community of sound engineers, vehicle audio builders, and DJ operators across India.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-blue-300 font-bold group-hover:text-white transition-colors">
                <span>Join Community</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </RevealOnScroll>

          {/* 4. Google Maps Shop Location */}
          <RevealOnScroll delay={200}>
            <a
              href={STUDIO_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#081510]/80 to-[#040d0a]/95 border border-emerald-500/30 hover:border-emerald-500/70 shadow-[0_10px_30px_rgba(16,185,129,0.1)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.25)] transition-all group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                    <GoogleMapsIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                    GPS Location
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold uppercase text-white mb-1">
                  Shop Location
                </h3>
                <p className="text-xs font-mono text-emerald-400 mb-3 font-semibold">
                  Transport Nagar, Kota
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                  Navigate directly to our workshop desk in Kota, Rajasthan with 1-click Google Maps GPS navigation.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-emerald-300 font-bold group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" /> Navigate Now
                </span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </RevealOnScroll>
        </div>

        {/* Milestone Statistics & Official GSTIN Strip */}
        <RevealOnScroll delay={250}>
          <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              {/* Stat 1 */}
              <div className="p-2 sm:p-4">
                <span className="font-display text-3xl sm:text-5xl font-black text-cyan-400 block tracking-tight">
                  {STUDIO_CONFIG.productSales || '10L+'}
                </span>
                <span className="text-xs sm:text-sm font-mono uppercase text-white font-bold tracking-wider block mt-1">
                  Products Sold
                </span>
                <span className="text-[11px] text-zinc-400 font-sans mt-0.5 block">
                  10,00,000+ Units Pan-India
                </span>
              </div>

              {/* Stat 2 */}
              <div className="p-2 sm:p-4">
                <span className="font-display text-3xl sm:text-5xl font-black text-red-400 block tracking-tight">
                  {STUDIO_CONFIG.totalDealers || '200+'}
                </span>
                <span className="text-xs sm:text-sm font-mono uppercase text-white font-bold tracking-wider block mt-1">
                  Total Dealers
                </span>
                <span className="text-[11px] text-zinc-400 font-sans mt-0.5 block">
                  Authorized Network Nationwide
                </span>
              </div>

              {/* Stat 3 */}
              <div className="p-2 sm:p-4 pt-4 md:pt-4">
                <span className="font-display text-3xl sm:text-5xl font-black text-cyan-400 block tracking-tight">
                  {STUDIO_CONFIG.established || '2018'}
                </span>
                <span className="text-xs sm:text-sm font-mono uppercase text-white font-bold tracking-wider block mt-1">
                  Estd. in Kota
                </span>
                <span className="text-[11px] text-zinc-400 font-sans mt-0.5 block">
                  Transport Nagar Headquarters
                </span>
              </div>

              {/* Stat 4 */}
              <div className="p-2 sm:p-4 pt-4 md:pt-4">
                <span className="font-display text-3xl sm:text-5xl font-black text-amber-300 block tracking-tight">
                  100%
                </span>
                <span className="text-xs sm:text-sm font-mono uppercase text-white font-bold tracking-wider block mt-1">
                  Paisa Vasool
                </span>
                <span className="text-[11px] text-zinc-400 font-sans mt-0.5 block">
                  True Value Sound Guaranteed
                </span>
              </div>
            </div>

            {/* GSTIN Government Verification Bar */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase block font-semibold">
                    Government Registered Audio Enterprise
                  </span>
                  <span className="text-sm font-mono font-black text-white tracking-widest">
                    GSTIN: {STUDIO_CONFIG.gstin}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Indian Manufacturer
                </span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
