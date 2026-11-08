import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Reveal } from '../ui/Reveal';
import {
  Speaker,
  Disc3,
  Home,
  Truck,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useDeviceMode } from '../../hooks/useDeviceMode';

const SERVICE_ICONS = {
  'dj-sound-systems': Disc3,
  'premium-speakers': Speaker,
  'home-audio': Home,
  'nationwide-dealership': Truck,
};

export function SoundSystemsSection() {
  const { t } = useLanguage();
  const { isMobile } = useDeviceMode();
  const sectionRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  // Touch & Pointer Gesture Refs
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const pointerStartXRef = useRef(null);

  const totalSlides = t.services.length;

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Auto-play circular globe slide show every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // IntersectionObserver to enable keyboard control when section is in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0.1, 0.2, 0.5] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Keyboard Arrow Key Navigation (Left / Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;
      if (!isInView) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, handleNext, handlePrev]);

  // Enhanced Mobile Touch Swipe Handlers (Horizontal gesture priority)
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Mouse Drag gesture for desktop users
  const handleMouseDown = (e) => {
    isPointerDownRef.current = true;
    pointerStartXRef.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isPointerDownRef.current || pointerStartXRef.current === null) return;
    const diffX = pointerStartXRef.current - e.clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
    isPointerDownRef.current = false;
    pointerStartXRef.current = null;
  };

  // 3D Circular Globe Spatial Mapping with Glassy Wings
  const getGlobeTransform = (idx) => {
    let diff = (idx - currentSlide + totalSlides) % totalSlides;
    if (diff > totalSlides / 2) diff -= totalSlides;

    const xOffset = isMobile ? '46%' : '56%';
    const rotateAngle = isMobile ? 24 : 32;
    const zDepth = isMobile ? -120 : -180;
    const scale = isMobile ? 0.88 : 0.85;

    // Center active card: presented right in the middle of the screen
    if (diff === 0) {
      return {
        transform: 'translate(-50%, -50%) translateX(0%) translateZ(0px) rotateY(0deg) scale(1)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto',
        isCenter: true,
        isGlassy: false,
        diff,
      };
    }

    // Upcoming card: curved along globe to the right with frosted glassy effect
    if (diff === 1) {
      return {
        transform: `translate(-50%, -50%) translateX(${xOffset}) translateZ(${zDepth}px) rotateY(-${rotateAngle}deg) scale(${scale})`,
        opacity: isMobile ? 0.65 : 0.78,
        zIndex: 20,
        pointerEvents: 'auto',
        isCenter: false,
        isGlassy: true,
        diff,
        label: 'Upcoming',
      };
    }

    // Previous card: curved along globe to the left with frosted glassy effect
    if (diff === -1) {
      return {
        transform: `translate(-50%, -50%) translateX(-${xOffset}) translateZ(${zDepth}px) rotateY(${rotateAngle}deg) scale(${scale})`,
        opacity: isMobile ? 0.65 : 0.78,
        zIndex: 20,
        pointerEvents: 'auto',
        isCenter: false,
        isGlassy: true,
        diff,
        label: 'Previous',
      };
    }

    // Distant cards on opposite side of globe
    const dir = diff > 0 ? 1 : -1;
    return {
      transform: `translate(-50%, -50%) translateX(${dir * 110}%) translateZ(-360px) rotateY(${-dir * 45}deg) scale(0.7)`,
      opacity: 0,
      zIndex: 10,
      pointerEvents: 'none',
      isCenter: false,
      isGlassy: true,
      diff,
    };
  };

  return (
    <section
      ref={sectionRef}
      id="systems"
      tabIndex={0}
      className="relative w-full py-12 sm:py-24 px-3 sm:px-6 md:px-10 bg-[#000000] overflow-x-clip acoustic-mesh-bg outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        isPointerDownRef.current = false;
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Title and Slide Show Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl space-y-3">
            <Reveal type="heading">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Our Core <span className="text-sonic-gradient">Amplifiers &amp; Sound Systems</span>
              </h2>
            </Reveal>

            <Reveal type="paragraph">
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                {t.systemsSubtitle}
              </p>
            </Reveal>
          </div>

          {/* Slide Show Prev / Next Lamp Controls + Keyboard Hint */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-end shrink-0">
            {/* Keyboard Arrow & Touch Swipe Hint Badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-cyan-400/20 text-[10px] font-mono text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-200 font-bold">←</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-200 font-bold">→</span>
              <span className="text-zinc-500">or Swipe</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Slide Index Display */}
              <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-400/25 text-xs font-mono text-zinc-300 backdrop-blur-md">
                <span className="text-cyan-300 font-bold font-mono">0{currentSlide + 1}</span>
                <span className="text-zinc-500 mx-1.5">/</span>
                <span className="text-zinc-400 font-mono">0{totalSlides}</span>
              </div>

              {/* Prev Button with Dual-Tone Logo Lamp Effect */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous System Slide (Keyboard Left Arrow)"
                className="relative group p-3 rounded-full bg-black/60 hover:bg-zinc-900 border border-white/15 hover:border-cyan-400/50 text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
              >
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <div className="w-6 h-[2px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                  <div className="w-12 h-6 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
                </div>
                <ChevronLeft className="w-5 h-5 relative z-10" />
              </button>

              {/* Next Button with Dual-Tone Logo Lamp Effect */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next System Slide (Keyboard Right Arrow)"
                className="relative group p-3 rounded-full bg-black/60 hover:bg-zinc-900 border border-white/15 hover:border-cyan-400/50 text-white transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
              >
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <div className="w-6 h-[2px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                  <div className="w-12 h-6 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
                </div>
                <ChevronRight className="w-5 h-5 relative z-10" />
              </button>

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-cyan-300 transition-colors ml-1 cursor-pointer bg-white/[0.04] border border-white/10"
                title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick-Jump Slide Tabs with Logo Cyan/Crimson Active Glow */}
        <div className="flex flex-wrap gap-2 mb-6">
          {t.services.map((service, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`relative group px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-zinc-950 text-cyan-200 border border-cyan-400/60 shadow-[0_0_18px_rgba(0,229,255,0.25)] font-bold'
                    : 'bg-black/50 text-zinc-400 hover:text-white border border-white/10 hover:border-cyan-400/30'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                    <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                    <div className="w-16 h-6 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
                  </div>
                )}
                <span className="relative z-10">
                  0{idx + 1} • {service.title.split(' ')[0]} {service.title.split(' ')[1] || ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── 3D CIRCULAR GLOBE SLIDESHOW STAGE ── */}
        <div
          className="relative w-full max-w-6xl mx-auto h-[480px] sm:h-[560px] my-3 sm:my-6 select-none cursor-grab active:cursor-grabbing"
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Celestial Globe Horizon Rings in Logo Electric Cyan & Crimson */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] max-w-[96vw] h-[360px] rounded-[100%] border border-cyan-400/20 pointer-events-none -z-10 shadow-[0_0_120px_rgba(0,229,255,0.12)]"
            style={{ transform: 'translate(-50%, -50%) rotateX(72deg)' }}
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] max-w-[86vw] h-[260px] rounded-[100%] border border-red-500/15 pointer-events-none -z-10"
            style={{ transform: 'translate(-50%, -50%) rotateX(72deg)' }}
          />

          {/* Cards Placed along 3D Circular Globe Arc */}
          {t.services.map((service, idx) => {
            const Icon = SERVICE_ICONS[service.id] || Speaker;
            const globeProps = getGlobeTransform(idx);
            const { isCenter, isGlassy, label } = globeProps;

            return (
              <div
                key={service.id}
                onClick={() => {
                  if (!isCenter) setCurrentSlide(idx);
                }}
                className={`absolute left-1/2 top-1/2 w-[92vw] max-w-[560px] sm:max-w-[620px] transition-all ${
                  !isCenter ? 'cursor-pointer hover:opacity-95' : ''
                }`}
                style={{
                  transform: globeProps.transform,
                  opacity: globeProps.opacity,
                  zIndex: globeProps.zIndex,
                  pointerEvents: globeProps.pointerEvents,
                  transformStyle: 'preserve-3d',
                  transition: 'all 650ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  className={`group relative p-4 sm:p-9 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85)] min-h-[400px] sm:min-h-[480px] ${
                    isCenter
                      ? 'bg-[#0c0c0e]/95 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,255,0.2)]'
                      : 'bg-black/40 backdrop-blur-2xl border border-white/20 hover:border-cyan-400/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Frosted Glass Sheen & Overlay for Previous/Upcoming Wings */}
                  {isGlassy && (
                    <div className="absolute inset-0 z-30 rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 pointer-events-none transition-all duration-500 flex flex-col items-center justify-between p-6">
                      <div className="w-full flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-cyan-400/30 text-[10px] font-mono uppercase tracking-widest text-cyan-200 font-bold shadow-sm">
                          {label}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="px-5 py-2.5 rounded-full bg-black/70 border border-cyan-400/40 backdrop-blur-xl text-xs font-mono font-bold uppercase tracking-widest text-white shadow-[0_4px_24px_rgba(0,0,0,0.8)] flex items-center gap-2 group-hover:scale-105 transition-transform">
                        <span>Click or Swipe</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
                      </div>

                      {/* Glass Specular Glare */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-cyan-400/[0.08] to-transparent pointer-events-none" />
                    </div>
                  )}

                  <div>
                    {/* Top Pill & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 rounded-2xl bg-zinc-900 border border-cyan-400/20 text-cyan-300 group-hover:scale-110 transition-transform shadow-md">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-xs text-cyan-200 font-bold px-3.5 py-1.5 rounded-full bg-zinc-900 border border-cyan-400/30 font-mono uppercase tracking-wider shadow-sm">
                        {service.accentTag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg sm:text-3xl font-black uppercase tracking-tight text-white mb-2 sm:mb-3 group-hover:text-cyan-100 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] sm:text-sm text-zinc-300 leading-relaxed mb-3 sm:mb-6 font-normal max-w-2xl line-clamp-3 sm:line-clamp-none">
                      {service.description}
                    </p>

                    {/* Deliverables / Specifications Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3 mb-3 sm:mb-6">
                      {service.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-2 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/5 text-[11px] sm:text-xs text-zinc-300"
                        >
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                        Custom Fabricated in Kota
                      </span>
                    </div>

                    <a
                      href="#dealership"
                      className="relative group/btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 text-cyan-100 border border-cyan-400/50 hover:border-cyan-300 text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] hover:scale-105 active:scale-95 overflow-hidden"
                    >
                      {/* Overhead Logo Lamp Fixture */}
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity flex flex-col items-center">
                        <div className="w-8 h-[2px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_8px_1.5px_#00e5ff]" />
                        <div className="w-16 h-6 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
                      </div>
                      <span className="relative z-10">{t.quickQuote}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-300 transition-transform group-hover/btn:translate-x-1 relative z-10" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Progress Dots Indicator in Logo Cyan & Red */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {t.services.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-10 bg-gradient-to-r from-cyan-400 to-red-500 shadow-[0_0_12px_#00e5ff]'
                  : 'w-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
