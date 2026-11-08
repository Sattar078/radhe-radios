import React, { useState, useEffect } from 'react';
import { useRouter } from '../router';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Radio,
  Speaker,
  CheckCircle2,
  PhoneCall,
  Volume2,
  ChevronRight
} from 'lucide-react';

export function OnboardingPage() {
  const { navigate } = useRouter();
  const { isHindi } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set page title for SEO & context
  useEffect(() => {
    document.title = 'Welcome to Radhe Radios Kota — Onboarding';
  }, []);

  const slides = [
    {
      id: 'heritage',
      step: '01 / 03',
      badge: 'ESTD. 2018 • TRANSPORT NAGAR, KOTA',
      icon: Radio,
      title: 'CUSTOM POWER AMPLIFIERS & PAISA VASOOL AUDIO',
      subtitle: '100% Made in India — Class-A Circuitry with Heavy Heatsinks',
      description: 'Welcome to Radhe Radios Kota. We engineer custom heavy-duty power amplifiers and professional sound systems crafted for thunderous bass, crystal-clear vocals, and decade-long durability.',
      highlights: [
        '100% Made in India Manufacturing',
        'Class-A Heavy-Duty Sound Architecture',
        '100% Paisa Vasool Value Guarantee'
      ],
      stat: { value: '2018', label: 'Estd. in Kota' }
    },
    {
      id: 'vehicles',
      step: '02 / 03',
      badge: 'VEHICLE AUDIO & PRO SOUND RIGS',
      icon: Speaker,
      title: 'ENGINEERED FOR BOLEROS, PICKUPS, TRACTORS & DJ RIGS',
      subtitle: 'Vibration-Damped Resonance Built for Rugged Indian Roads',
      description: 'From rough village roads to high-decibel roadshows, our power amplifiers and dual 18-inch sub-bass cabinets deliver continuous, distortion-free output with zero battery drain.',
      highlights: [
        'Dual 18" Sub-Bass & 15" Mid-Tops',
        'Vibration-Proof Waterproof Wooden Chassis',
        '12V / 24V High-Efficiency Power Rails'
      ],
      stat: { value: '18"', label: 'Dual Bass Rig' }
    },
    {
      id: 'direct-access',
      step: '03 / 03',
      badge: 'DIRECT WORKSHOP ACCESS & PAN-INDIA REACH',
      icon: Zap,
      title: 'DIRECT FACTORY RATES & ALL-INDIA SAFE DELIVERY',
      subtitle: 'Transparent Wholesale Access for Sound Operators & Clients',
      description: 'Connect directly with our master technicians in Transport Nagar, Kota. Enjoy transparent factory rates, instant schematic blueprints, and dedicated helpline support across all Indian states.',
      highlights: [
        'Direct Factory Wholesale Rates',
        'Doorstep Delivery to Towns & Villages',
        '24x7 WhatsApp & Phone Support'
      ],
      stat: { value: '100%', label: 'Original Quality' }
    }
  ];

  const current = slides[currentSlide];

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = (e) => {
    e?.preventDefault();
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleGetStarted = () => {
    // Navigate directly to the auth page
    navigate('/auth');
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  const IconComponent = current.icon;

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
      {/* ── Background Liquid Glass Atmosphere ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Luminous Monochrome Radial Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/[0.08] blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[160px] pointer-events-none" />
        
        {/* Subtle Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* ── Main Liquid Glass Container with EXACT 0.4s Starting Animation ── */}
      <div 
        className="relative w-full max-w-4xl z-10"
        style={{
          animation: 'onboardingEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <style>{`
          @keyframes onboardingEntrance {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(24px);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0px);
            }
          }
        `}</style>

        {/* ── Liquid Glass Card ────────────────────────────────────────────── */}
        <div className="relative rounded-3xl sm:rounded-[32px] overflow-hidden backdrop-blur-2xl bg-[#0c0c0e]/95 border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)]">
          
          {/* Top Glass Refraction Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80" />

          {/* Header Controls Inside Card */}
          <div className="flex items-center justify-between px-6 sm:px-10 pt-6 sm:pt-8 pb-4 border-b border-white/[0.06]">
            {/* Brand Monogram Glass Pill */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-mono font-black text-xs shadow-sm">
                RR
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-xs sm:text-sm tracking-wider uppercase text-white">
                  RADHE RADIOS
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  KOTA • ESTD. 2018
                </span>
              </div>
            </div>

            {/* Step Counter & Skip Option */}
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-semibold text-white px-3 py-1 rounded-full bg-white/10 border border-white/20">
                {current.step}
              </span>
              <button
                onClick={handleSkip}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors uppercase tracking-wider py-1 px-2 rounded-lg hover:bg-white/[0.04] cursor-pointer"
              >
                Skip to Login
              </button>
            </div>
          </div>

          {/* Slide Body */}
          <div className="p-6 sm:p-10 md:p-12">
            <div
              className={`transition-all duration-200 ${
                isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Badge & Icon Row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white font-mono text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>{current.badge}</span>
                </div>
              </div>

              {/* Slide Headline */}
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-[#F5F5F5] tracking-tight leading-[1.15] mb-3">
                {current.title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base font-semibold text-zinc-300 mb-5 font-sans">
                {current.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mb-8 font-normal">
                {current.description}
              </p>

              {/* Glass Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {current.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span className="text-xs text-zinc-200 font-medium leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls: Dots, Prev, Next / Get Started */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-5 sm:py-6 bg-black/40 border-t border-white/[0.06] backdrop-blur-md">
            
            {/* Visual Glass Dots / Progress Indicator */}
            <div className="flex items-center gap-2.5">
              {slides.map((s, index) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentSlide === index
                      ? 'w-10 bg-white shadow-[0_0_10px_#FFFFFF]'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {/* Back Button (Hidden on first slide) */}
              {currentSlide > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              {/* Next Slide Button (Slide 0 & 1) */}
              {currentSlide < slides.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* LAST SLIDE: GET STARTED BUTTON (Navigates to /auth) */
                <button
                  type="button"
                  onClick={handleGetStarted}
                  id="get-started-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs sm:text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-md cursor-pointer"
                >
                  <span>GET STARTED</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
