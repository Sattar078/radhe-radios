import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Reveal } from '../ui/Reveal';
import { Cpu, Hammer, Activity, Truck, ChevronLeft, ChevronRight, Pause, Play, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STEP_ICONS = [Cpu, Hammer, Activity, Truck];

export function CraftProcessSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Touch Gesture Refs
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const pointerStartXRef = useRef(null);

  const steps = t.workflow.steps;
  const totalSlides = steps.length;

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Auto-play slideshow every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // IntersectionObserver for keyboard controls
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

  return (
    <section
      ref={sectionRef}
      id="craft"
      tabIndex={0}
      className="relative w-full py-12 px-3 sm:py-28 sm:px-10 bg-[#000000] overflow-hidden acoustic-mesh-bg outline-none"
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
        {/* Header with Navigation Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl space-y-4">
            <Reveal type="heading">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                How Every Amplifier &amp; Rig is <span className="text-sonic-gradient">Engineered in Kota</span>
              </h2>
            </Reveal>

            <Reveal type="paragraph">
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                {t.workflow.description}
              </p>
            </Reveal>
          </div>

          {/* Slideshow Controls + Keyboard Hint */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            {/* Keyboard & Swipe Hint */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-cyan-400/20 text-[10px] font-mono text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-200 font-bold">←</span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-400/15 text-cyan-200 font-bold">→</span>
              <span className="text-zinc-500">or Swipe</span>
            </div>

            <div className="flex items-center gap-2 bg-[#0c0c0e] border border-cyan-400/20 rounded-full px-3 py-1.5 backdrop-blur-xl">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous step (Keyboard Left Arrow)"
                className="lamp-btn w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-cyan-400/50 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-bold text-cyan-300 px-2 tracking-widest min-w-[58px] text-center">
                {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next step (Keyboard Right Arrow)"
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

        {/* Step Indicator Bar / Quick Slide Switcher in Logo Theme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx] || Cpu;
            const isActive = currentSlide === idx;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-zinc-950 border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.2)] scale-102'
                    : 'bg-[#0c0c0e]/80 border-white/5 hover:border-cyan-400/30 text-zinc-400 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-gradient-to-r from-cyan-400 to-red-500 text-black shadow-md' : 'bg-white/5 text-zinc-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    Step {step.step}
                  </span>
                  <span className={`block font-display text-xs font-bold uppercase truncate ${isActive ? 'text-cyan-200' : 'text-zinc-300'}`}>
                    {step.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Slideshow Viewport */}
        <div
          className="relative w-full overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div
            className="flex transition-transform duration-600 ease-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {steps.map((step, idx) => {
              const Icon = STEP_ICONS[idx] || Cpu;
              return (
                <div
                  key={step.step}
                  className="w-full shrink-0 px-1"
                >
                  <div className="relative p-4 sm:p-12 rounded-2xl sm:rounded-3xl bg-[#0c0c0e] border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-8 backdrop-blur-2xl">
                    <div className="space-y-2.5 sm:space-y-4 max-w-2xl">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                          Phase {step.step} Protocol
                        </span>
                        <span className="font-mono text-[10px] sm:text-xs text-zinc-500">
                          Step {idx + 1} of {totalSlides}
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                        {step.name}
                      </h3>

                      <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-normal">
                        {step.desc}
                      </p>

                      <div className="flex items-center gap-2 pt-2 text-xs font-mono text-cyan-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                        <span>Factory Calibrated &amp; Certified for Continuous 48-Hour Live Duty</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-center justify-center p-8 rounded-3xl bg-black/60 border border-cyan-400/20 text-center min-w-[200px]">
                      <div className="p-5 rounded-2xl bg-white/10 text-white mb-4">
                        <Icon className="w-10 h-10 text-cyan-400" />
                      </div>
                      <span className="font-display text-4xl font-black text-white/30 tracking-wider">
                        {step.step}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider mt-1">
                        Stage Certified
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Dots in Logo Colors */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {steps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Jump to step ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-gradient-to-r from-cyan-400 to-red-500 shadow-[0_0_12px_#00e5ff]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
