import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Reveal } from '../ui/Reveal';
import {
  Sparkles,
  SlidersHorizontal,
  Zap,
  Radio,
  Volume2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Tag,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useDeviceMode } from '../../hooks/useDeviceMode';
import { productsApi } from '../../services/api';
import { Link } from '../../router';
import { getWhatsAppOrderUrl, WhatsAppIcon } from '../../utils/whatsapp.js';

export function ProductShowcaseSection() {
  const { t } = useLanguage();
  const { isMobile } = useDeviceMode();
  const sectionRef = useRef(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Touch & Pointer Gesture Refs
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const pointerStartXRef = useRef(null);

  const [liveProducts, setLiveProducts] = useState(null);

  // Fetch live products from backend to reflect admin changes in real time
  useEffect(() => {
    let active = true;
    productsApi.list()
      .then((data) => {
        if (active && data && Array.isArray(data.products) && data.products.length > 0) {
          setLiveProducts(data.products);
        }
      })
      .catch((err) => {
        console.warn('Live products fallback to static:', err);
      });
    return () => { active = false; };
  }, []);

  const allProducts = useMemo(() => {
    if (!liveProducts || liveProducts.length === 0) return t.products;
    const formattedLive = liveProducts.map((p) => ({
      id: p.id || p._id,
      title: p.title || p.name,
      category: p.category,
      badge: p.badge || (p.price ? `₹${Number(p.price).toLocaleString('en-IN')}` : 'Pro Audio'),
      price: p.price,
      description: p.description,
      image: p.image || '/frames/frame_0180.jpg',
      specs: {
        powerHandling: p.specs?.powerHandling || `${p.watts || 2000}W Peak`,
        driverSize: p.specs?.driverSize || 'High-Excursion Driver',
        frequencyRange: p.specs?.frequencyRange || '28Hz - 160Hz',
        enclosure: p.specs?.enclosure || 'Reinforced Birch Wood',
      },
      tags: p.tags || [],
    }));

    const liveIds = new Set(formattedLive.map((lp) => lp.id));
    const extraStatic = t.products.filter((sp) => !liveIds.has(sp.id));
    return [...formattedLive, ...extraStatic];
  }, [liveProducts, t.products]);

  const categories = useMemo(() => {
    const defaultCats = t.categories || ['All Systems', 'Custom Power Amplifiers', 'Vehicle Audio Setups', 'Heavy Bass Speakers'];
    const dynamicCats = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean)));
    const merged = [defaultCats[0], ...new Set([...defaultCats.slice(1), ...dynamicCats])];
    return merged;
  }, [t.categories, allProducts]);

  const activeCategoryName = categories[activeCategoryIndex] || categories[0];

  const filteredProjects = activeCategoryIndex === 0
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategoryName);

  const totalSlides = filteredProjects.length;

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Reset slide index when category changes
  const handleCategoryChange = (idx) => {
    setActiveCategoryIndex(idx);
    setCurrentSlide(0);
  };

  // Auto-play circular globe slideshow every 6 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, handleNext]);

  // IntersectionObserver for keyboard arrow controls when section is in view
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

  // Mouse drag support for desktop
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

  // 3D Circular Globe Spatial Coordinates
  const getGlobeTransform = (idx) => {
    let diff = (idx - currentSlide + totalSlides) % totalSlides;
    if (diff > totalSlides / 2) diff -= totalSlides;

    const xOffset = isMobile ? '46%' : '56%';
    const rotateAngle = isMobile ? 24 : 32;
    const zDepth = isMobile ? -120 : -180;
    const scale = isMobile ? 0.88 : 0.85;

    // Center active card: in the middle of the screen
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

    // Upcoming card: curved along globe to the right with glassy frosted effect
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

    // Previous card: curved along globe to the left with glassy frosted effect
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

    // Far cards on back of globe
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
      id="showcase"
      tabIndex={0}
      className="relative w-full py-12 sm:py-28 px-3 sm:px-6 md:px-10 bg-[#000000] overflow-x-clip select-none outline-none"
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
        {/* Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="max-w-2xl space-y-4">
            <Reveal type="heading">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Tested Rigs &amp; <span className="text-sonic-gradient">Heavy-Duty Cabinets</span>
              </h2>
            </Reveal>

            <Reveal type="paragraph">
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                {t.showcase.description}
              </p>
            </Reveal>
          </div>

          {/* Slideshow HUD Navigation & Category Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(idx)}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategoryIndex === idx
                      ? 'bg-gradient-to-r from-cyan-400 to-red-500 text-black font-extrabold shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-102'
                      : 'bg-[#0c0c0e] text-zinc-400 hover:text-white border border-white/10 hover:border-cyan-400/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Keyboard & Swipe Hint */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-cyan-400/20 text-[10px] font-mono text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-200 font-bold">←</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-200 font-bold">→</span>
              <span className="text-zinc-500">or Swipe</span>
            </div>

            {/* Slideshow Arrow Controls with Logo Lamp Effect */}
            <div className="flex items-center gap-2 bg-[#0c0c0e] border border-cyan-400/20 rounded-full px-3 py-1.5 backdrop-blur-xl shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous slide (Keyboard Left Arrow)"
                className="lamp-btn w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-cyan-400/50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-bold text-cyan-300 px-2 tracking-widest min-w-[58px] text-center">
                {String(currentSlide + 1).padStart(2, '0')} / {String(Math.max(totalSlides, 1)).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next slide (Keyboard Right Arrow)"
                className="lamp-btn w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-cyan-400/50 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-cyan-400 transition-colors ml-1 cursor-pointer"
                title={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── 3D CIRCULAR GLOBE STAGE VIEWPORT ── */}
        <div
          className="relative w-full max-w-6xl mx-auto h-[520px] sm:h-[580px] lg:h-[520px] my-3 sm:my-6 select-none cursor-grab active:cursor-grabbing"
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Celestial Globe Horizon Rings in Logo Electric Cyan & Crimson */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] max-w-[96vw] h-[380px] rounded-[100%] border border-cyan-400/20 pointer-events-none -z-10 shadow-[0_0_120px_rgba(0,229,255,0.12)]"
            style={{ transform: 'translate(-50%, -50%) rotateX(72deg)' }}
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[660px] max-w-[86vw] h-[280px] rounded-[100%] border border-red-500/15 pointer-events-none -z-10"
            style={{ transform: 'translate(-50%, -50%) rotateX(72deg)' }}
          />

          {/* Cards Placed along 3D Circular Globe Arc */}
          {filteredProjects.map((project, idx) => {
            const globeProps = getGlobeTransform(idx);
            const { isCenter, isGlassy, label } = globeProps;

            return (
              <div
                key={project.id || idx}
                onClick={() => {
                  if (!isCenter) setCurrentSlide(idx);
                }}
                className={`absolute left-1/2 top-1/2 w-[92vw] max-w-[620px] lg:max-w-[760px] transition-all ${
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
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 flex flex-col md:flex-row shadow-[0_25px_60px_rgba(0,0,0,0.85)] ${
                    isCenter
                      ? 'bg-[#0c0c0e]/95 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,229,255,0.2)]'
                      : 'bg-black/45 backdrop-blur-2xl border border-white/20 hover:border-cyan-400/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Frosted Glass Sheen & Overlay for Previous/Upcoming Wings */}
                  {isGlassy && (
                    <div className="absolute inset-0 z-30 rounded-2xl sm:rounded-3xl bg-black/45 backdrop-blur-xl border border-white/20 pointer-events-none transition-all duration-500 flex flex-col items-center justify-between p-4 sm:p-6">
                      <div className="w-full flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-cyan-400/30 text-[10px] font-mono uppercase tracking-widest text-cyan-200 font-bold shadow-sm">
                          {label}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          0{idx + 1}
                        </span>
                      </div>

                      <div className="px-4 py-2 rounded-full bg-black/70 border border-cyan-400/40 backdrop-blur-xl text-xs font-mono font-bold uppercase tracking-widest text-white shadow-[0_4px_24px_rgba(0,0,0,0.8)] flex items-center gap-2 group-hover:scale-105 transition-transform">
                        <span>Click or Swipe</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
                      </div>

                      {/* Glass Specular Glare */}
                      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-transparent via-cyan-400/[0.08] to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Product Frame Showcase Image */}
                  <div className="relative aspect-video md:aspect-auto md:w-1/2 overflow-hidden bg-black min-h-[160px] sm:min-h-[220px] md:min-h-[380px]">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-10">
                      <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-black/85 border border-cyan-400/30 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-cyan-200 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-10">
                      <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-400/40 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white backdrop-blur-md font-bold">
                        {project.badge}
                      </span>
                    </div>
                  </div>

                  {/* Specs & Description Column */}
                  <div className="p-3.5 sm:p-7 md:w-1/2 flex flex-col justify-between space-y-2.5 sm:space-y-4 bg-gradient-to-b from-[#0c0c0e] to-black">
                    <div className="space-y-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold block">
                        Rig Configuration 0{idx + 1}
                      </span>

                      <h3 className="font-display text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight group-hover:text-cyan-100 transition-colors">
                        {project.title}
                      </h3>

                      {project.price && (
                        <div className="flex items-center gap-2 font-mono text-sm font-bold text-cyan-300">
                          <Tag className="w-3.5 h-3.5 text-red-400" />
                          <span>₹{Number(project.price).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-zinc-400 font-normal uppercase tracking-wider">Workshop Direct</span>
                        </div>
                      )}

                      <p className="text-xs text-zinc-300 leading-relaxed font-normal line-clamp-2">
                        {project.description}
                      </p>

                      {/* Technical Specifications Grid */}
                      {project.specs && (
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-[9px] uppercase text-zinc-500 block leading-none">Power</span>
                              <span className="font-semibold text-white text-[11px] truncate block">{project.specs.powerHandling}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-[9px] uppercase text-zinc-500 block leading-none">Driver</span>
                              <span className="font-semibold text-white text-[11px] truncate block">{project.specs.driverSize}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300">
                            <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-[9px] uppercase text-zinc-500 block leading-none">Frequency</span>
                              <span className="font-semibold text-white text-[11px] truncate block">{project.specs.frequencyRange}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-zinc-300">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <div className="truncate">
                              <span className="text-[9px] uppercase text-zinc-500 block leading-none">Enclosure</span>
                              <span className="font-semibold text-white text-[11px] truncate block">{project.specs.enclosure}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons: WhatsApp Order & View in Store */}
                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-2">
                      <a
                        href={getWhatsAppOrderUrl(project)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:scale-[1.02]"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>Order on WhatsApp</span>
                      </a>

                      <Link
                        to={`/store?product=${project.id}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 hover:border-cyan-400 text-cyan-200 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <span>Store Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slide Progress Dots in Logo Colors */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {filteredProjects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-gradient-to-r from-cyan-400 to-red-500 shadow-[0_0_12px_rgba(0,229,255,0.6)]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
