import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, ShieldCheck, LogOut, ChevronDown, MapPin } from 'lucide-react';
import { Link, useRouter } from '../../router';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { STUDIO_CONFIG } from '../../data/studioData';
import { InstagramIcon, FacebookIcon, GoogleMapsIcon } from '../ui/SocialIcons';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const { currentPath } = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isHindi } = useLanguage();
  const dropdownRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(currentScrollY > 25);

          // Always reveal navbar near the very top of the page
          if (currentScrollY < 40) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollYRef.current + 8) {
            // Scrolling downward -> hide navbar (keep visible if mobile menu is open)
            if (!mobileMenuOpen) {
              setIsVisible(false);
            }
          } else if (currentScrollY < lastScrollYRef.current - 8) {
            // Scrolling upward -> reveal navbar
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean navigation links: Home, Store, About Us
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'About Us', path: '/about' },
  ];

  const isLinkActive = (path) => {
    if (path === '/') return currentPath === '/' || currentPath === '';
    if (path === '/store') return currentPath === '/store' || currentPath === '/products' || currentPath === '/systems' || currentPath === '/catalogue' || currentPath === '/shop';
    return currentPath === path;
  };

  const isAuthActive = currentPath === '/auth' || currentPath === '/login' || currentPath === '/signup';

  return (
    <header
      className={`fixed top-3 sm:top-5 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-400 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-28 opacity-0'
      }`}
    >
      <div
        className={`pointer-events-auto max-w-5xl mx-auto flex items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-2xl sm:rounded-full transition-all duration-300 ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border border-transparent shadow-none'
        }`}
      >
        {/* Brand Logo (Radhe Radios SVG) */}
        <Link
          to="/"
          aria-label="Radhe Radios Home"
          className="group flex items-center justify-center p-0.5 sm:p-1 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-transform hover:scale-105"
        >
          <img
            src="/radhe radios logo.svg"
            alt="Radhe Radios Logo"
            className="h-11 sm:h-16 md:h-20 w-auto max-h-[48px] sm:max-h-[75px] md:max-h-[88px] object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_24px_rgba(239,68,68,0.75)]"
          />
        </Link>

        {/* Desktop Navigation Links with Electric Cyan & Crimson Lamp Light Effect */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative group px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center justify-center overflow-hidden focus:outline-none ${
                  isActive
                    ? 'text-cyan-100 bg-zinc-900/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,229,255,0.3)] border border-cyan-400/50'
                    : 'text-zinc-300 hover:text-cyan-100 bg-black/40 hover:bg-zinc-900/80 border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_4px_14px_rgba(0,229,255,0.2)]'
                }`}
              >
                {/* Overhead Cyan & Crimson Lamp Fixture & Downward Light Beam */}
                <div
                  className={`absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 flex flex-col items-center ${
                    isActive
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                  }`}
                >
                  {/* Glowing Logo-Color Lamp Filament */}
                  <div className="w-8 h-[2.5px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_10px_2px_#00e5ff,0_0_20px_4px_rgba(239,68,68,0.8)]" />
                  {/* Downward Conic Spotlight */}
                  <div className="w-20 h-10 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_rgba(239,68,68,0.15)_55%,_transparent_75%)] blur-[0.5px]" />
                </div>

                {/* Button Text with logo glow on active/hover */}
                <span
                  className={`relative z-10 transition-all ${
                    isActive
                      ? 'font-bold text-cyan-100 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]'
                      : 'group-hover:drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]'
                  }`}
                >
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: Language Button & Login Button */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher Pill with Lamp Effect */}
          <LanguageSwitcher />

          {/* Login / Auth Button with Lamp Effect */}
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="relative group flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer bg-black/40 hover:bg-zinc-900/80 border border-white/15 hover:border-cyan-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden"
              >
                {/* Top Lamp Light on profile button */}
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                  <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_10px_2px_#00e5ff]" />
                  <div className="w-18 h-8 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
                </div>

                <div className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center bg-zinc-900 border border-cyan-400/40 text-cyan-200 shadow-sm relative z-10">
                  {user.avatar || (isAdmin ? 'AD' : 'RS')}
                </div>
                <div className="text-left hidden lg:block relative z-10">
                  <span className="block text-xs font-bold text-white group-hover:text-cyan-100 leading-none">
                    {user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                  <span className="block text-[9px] font-semibold uppercase leading-tight mt-0.5 text-cyan-300/80">
                    {isAdmin ? 'ADMIN' : 'Account'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-300 transition-transform relative z-10 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#08080a]/98 backdrop-blur-2xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.95)] p-3 text-white z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2.5 border-b border-white/10 mb-2">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-zinc-400">{user.role}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{user.phone || user.email}</p>
                  </div>

                  <Link
                    to="/portal"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors text-zinc-200 hover:text-white hover:bg-white/10"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>{isAdmin ? 'Workshop Admin Panel' : 'Client Portal'}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors mt-1 border-t border-white/10 pt-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-zinc-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className={`relative group px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 overflow-hidden cursor-pointer ${
                isAuthActive
                  ? 'text-white bg-gradient-to-r from-cyan-900/60 to-red-900/60 border border-cyan-400/80 shadow-[0_0_24px_rgba(0,229,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]'
                  : 'text-white bg-gradient-to-r from-cyan-950/80 via-zinc-900 to-red-950/80 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:border-red-400/80 hover:shadow-[0_0_28px_rgba(239,68,68,0.55)] hover:scale-105 active:scale-95'
              }`}
            >
              {/* Active Cyan & Crimson Lamp Fixture */}
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 flex flex-col items-center">
                <div className="w-10 h-[2.5px] bg-gradient-to-r from-cyan-400 via-sky-300 to-red-500 rounded-full shadow-[0_0_12px_2.5px_#00e5ff,0_0_24px_5px_rgba(239,68,68,0.85)]" />
                <div className="w-24 h-10 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.55)_0%,_rgba(239,68,68,0.18)_55%,_transparent_75%)] blur-[0.5px]" />
              </div>

              <User className="w-3.5 h-3.5 text-cyan-300 relative z-10" />
              <span className="relative z-10 font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                Get Started
              </span>
            </Link>
          )}
        </div>

        {/* Mobile Header Right: Compact Language Pill + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher variant="compact" />

          {!isAuthenticated && (
            <Link
              to="/auth"
              className="relative group px-3.5 py-1.5 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/80 to-red-950/80 text-cyan-200 font-bold text-xs shadow-[0_0_12px_rgba(0,229,255,0.3)] overflow-hidden"
            >
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                <div className="w-6 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                <div className="w-14 h-6 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
              </div>
              <span className="relative z-10">Get Started</span>
            </Link>
          )}

          <button
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative group p-2 rounded-xl text-zinc-300 hover:text-cyan-200 bg-black/40 hover:bg-zinc-900/80 border border-white/10 hover:border-cyan-400/40 transition-colors focus:outline-none cursor-pointer overflow-hidden"
          >
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
              <div className="w-5 h-[1.5px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_6px_1px_#00e5ff]" />
              <div className="w-10 h-6 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
            </div>
            {mobileMenuOpen ? <X className="w-5 h-5 relative z-10 text-cyan-400" /> : <Menu className="w-5 h-5 relative z-10" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-5xl mx-auto rounded-2xl bg-[#08080a]/98 backdrop-blur-2xl border border-white/15 p-4 flex flex-col gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.95)] animate-in fade-in slide-in-from-top-2 pointer-events-auto">
          {isAuthenticated && user && (
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-between mb-1">
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-xs text-zinc-400">{user.role}</p>
              </div>
              <Link
                to="/portal"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-red-500 text-white text-xs font-bold"
              >
                Account
              </Link>
            </div>
          )}

          {/* 3 Nav Links */}
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`relative group px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between overflow-hidden ${
                  isActive
                    ? 'text-cyan-200 bg-zinc-900 font-bold border border-cyan-400/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                    : 'text-zinc-300 hover:text-cyan-100 bg-white/[0.02] hover:bg-zinc-900/60 border border-transparent hover:border-cyan-400/30'
                }`}
              >
                {/* Lamp Fixture */}
                <div
                  className={`absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none transition-all flex flex-col items-center ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                  <div className="w-18 h-8 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
                </div>
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] relative z-10" />
                )}
              </Link>
            );
          })}

          {/* Mobile Login / Logout Link */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="mt-1 py-2 text-center text-xs text-zinc-400 hover:text-cyan-200 font-bold cursor-pointer"
            >
              Log Out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="relative group mt-2 py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-cyan-950/80 to-red-950/80 border border-cyan-400/50 rounded-xl shadow-[0_0_16px_rgba(0,229,255,0.3)] overflow-hidden"
            >
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                <div className="w-10 h-[2px] bg-gradient-to-r from-cyan-400 to-red-500 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                <div className="w-24 h-8 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
              </div>
              <span className="relative z-10">Get Started / Login</span>
            </Link>
          )}
          {/* Quick Social & Location Bar in Mobile Drawer */}
          <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-around text-xs font-mono">
            <a
              href={STUDIO_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] text-pink-400 hover:text-white transition-colors"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold">Instagram</span>
            </a>

            <a
              href={STUDIO_CONFIG.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] text-blue-400 hover:text-white transition-colors"
              title="Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold">Facebook</span>
            </a>

            <a
              href={STUDIO_CONFIG.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] text-emerald-400 hover:text-white transition-colors"
              title="Workshop on Google Maps"
            >
              <GoogleMapsIcon className="w-4 h-4" />
              <span className="text-[11px] font-bold">Location</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
