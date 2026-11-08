import React from 'react';
import { ArrowUp, MapPin, Radio, ShieldCheck } from 'lucide-react';
import { STUDIO_CONFIG, SOCIAL_LINKS } from '../../data/studioData';
import { InstagramIcon, YoutubeIcon } from '../ui/SocialIcons';
import { Link } from '../../router';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { t, isHindi } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#000000] pt-20 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/radhe radios logo.svg"
                alt="Radhe Radios Logo"
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_16px_rgba(0,229,255,0.5)]"
              />
              <span className="font-display font-extrabold text-xl tracking-[0.16em] uppercase text-white">
                {t.brandName}
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed font-normal">
              {t.footer.description}
            </p>
            <div className="flex flex-col gap-2 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-2 text-zinc-300">
                <MapPin className="w-4 h-4 shrink-0 text-white" />
                <span>{STUDIO_CONFIG.location}</span>
              </span>
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
            <Link to="/products" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t.nav.products}
            </Link>
            <Link to="/services" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t.nav.services}
            </Link>
            <Link to="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">
              {t.nav.contact}
            </Link>
            <Link to="/portal" className="text-sm text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>{t.nav.portal}</span>
            </Link>
          </div>

          {/* Official Channels & Language Switcher */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                {t.footer.channels}
              </span>
              <LanguageSwitcher variant="compact" />
            </div>

            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => {
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/30 hover:bg-white/[0.05] text-sm text-white flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{social.name}</span>
                      <span className="text-zinc-400 text-xs font-mono">{social.handle}</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                      ↗
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            &copy; {CURRENT_YEAR} {t.brandName}. All rights reserved. {STUDIO_CONFIG.location}.
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
