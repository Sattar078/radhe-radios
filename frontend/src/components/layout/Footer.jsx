import React from 'react';
import { ArrowUp, MapPin, Radio, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react';
import { STUDIO_CONFIG, SOCIAL_LINKS } from '../../data/studioData';
import { InstagramIcon, FacebookIcon, YoutubeIcon, GoogleMapsIcon, WhatsAppIcon } from '../ui/SocialIcons';
import { Link } from '../../router';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (type) => {
    switch (type) {
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />;
      case 'facebook':
        return <FacebookIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'youtube':
        return <YoutubeIcon className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />;
      case 'maps':
        return <GoogleMapsIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />;
      case 'whatsapp':
        return <WhatsAppIcon className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />;
      default:
        return <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <footer className="w-full bg-[#000000] pt-10 sm:pt-20 pb-8 sm:pb-12 text-white border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        {/* Milestone Banner (Product Sales, Dealers, Made in India) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 pb-10 border-b border-white/[0.08]">
          <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left">
            <span className="block text-xl sm:text-2xl font-black text-cyan-400 font-display">
              {STUDIO_CONFIG.productSales || '10L+'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
              Products Sold
            </span>
            <span className="block text-[9px] text-zinc-500 font-sans mt-0.5">
              10,00,000+ Units Pan-India
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left">
            <span className="block text-xl sm:text-2xl font-black text-red-400 font-display">
              {STUDIO_CONFIG.totalDealers || '200+'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
              Authorized Dealers
            </span>
            <span className="block text-[9px] text-zinc-500 font-sans mt-0.5">
              Pan-India Distribution Network
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left">
            <span className="block text-xl sm:text-2xl font-black text-cyan-400 font-display">
              {STUDIO_CONFIG.established || '2018'}
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
              Estd. in Kota
            </span>
            <span className="block text-[9px] text-zinc-500 font-sans mt-0.5">
              Transport Nagar Workshop
            </span>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-left">
            <span className="block text-xl sm:text-2xl font-black text-amber-300 font-display">
              100%
            </span>
            <span className="text-[10px] sm:text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
              Paisa Vasool
            </span>
            <span className="block text-[9px] text-zinc-500 font-sans mt-0.5">
              True Value Audio Guaranteed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-8 sm:pb-16">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <img
                src="/radhe radios logo.svg"
                alt="Radhe Radios Logo"
                className="h-10 sm:h-16 w-auto object-contain drop-shadow-[0_0_16px_rgba(0,229,255,0.5)]"
              />
              <span className="font-display font-extrabold text-base sm:text-xl tracking-[0.16em] uppercase text-white">
                {t.brandName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-4 sm:mb-6 leading-relaxed font-normal">
              {t.footer.description}
            </p>

            {/* Official GSTIN Verification Badge */}
            <div className="mb-5 p-3 rounded-2xl bg-white/[0.03] border border-cyan-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold">GSTIN:</span>
                <span className="text-xs font-mono font-bold text-white tracking-widest">{STUDIO_CONFIG.gstin}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 w-fit">
                <CheckCircle2 className="w-3 h-3" />
                Govt. Registered
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-mono text-zinc-400">
              <a
                href={STUDIO_CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-cyan-300 transition-colors group"
              >
                <MapPin className="w-4 h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>{STUDIO_CONFIG.location}</span>
                <span className="text-[10px] text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                  <Navigation className="w-2.5 h-2.5" /> Navigate
                </span>
              </a>
              <span className="flex items-center gap-2 text-zinc-400">
                <Radio className="w-4 h-4 shrink-0 text-white" />
                <span>{STUDIO_CONFIG.reach}</span>
              </span>
            </div>
          </div>

          {/* Quick Route Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-white mb-2 font-semibold">
              {t.footer.quickLinks}
            </span>
            <Link to="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t.nav.home}
            </Link>
            <Link to="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t.nav.about}
            </Link>
            <Link to="/store" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Store & Systems
            </Link>
            <Link to="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Contact & Workshop Desk
            </Link>
            <a
              href={STUDIO_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <GoogleMapsIcon className="w-3.5 h-3.5" />
              <span>Shop on Google Maps ↗</span>
            </a>
            <Link to="/portal" className="text-sm text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>{t.nav.portal}</span>
            </Link>
          </div>

          {/* Official Channels & Language Switcher */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                Official Channels & Handles
              </span>
              <LanguageSwitcher variant="compact" />
            </div>

            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((social) => {
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.05] text-sm text-white flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {getSocialIcon(social.type)}
                      <div>
                        <span className="font-bold text-white block leading-tight">{social.name}</span>
                        <span className="text-zinc-400 text-[11px] font-mono">{social.handle}</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 group-hover:text-cyan-300 transition-colors">
                      ↗
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            &copy; {CURRENT_YEAR} {t.brandName}. All rights reserved. GSTIN: {STUDIO_CONFIG.gstin} • {STUDIO_CONFIG.location}.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
