import React, { useState, useEffect } from 'react';
import { useRouter } from '../../router';
import {
  ArrowRight,
  ArrowLeft,
  Radio,
  Speaker,
  Zap,
  CheckCircle2,
  Activity,
  LogIn,
} from 'lucide-react';

export function WelcomeOnboardingModal({ isOpen = true, onClose }) {
  const { navigate } = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  if (!visible) return null;

  const slides = [
    {
      id: 'heritage',
      step: '01 / 03',
      freq: '20Hz - 25kHz',
      badge: 'ACOUSTIC ENGINEERING • ESTD. 2018',
      icon: Radio,
      title: 'HIGH-POWER CLASS-A AMPLIFIERS & ACOUSTIC RIGS',
      subtitle: '100% Made in India — Toroidal Transformers & Massive Heatsinks',
      description: 'Welcome to Radhe Radios Kota. We engineer custom heavy-duty power amplifiers and professional sound systems crafted for thunderous bass, crystal-clear vocals, and decade-long durability.',
      highlights: [
        '100% Made in India Manufacturing',
        'Class-A Heavy-Duty Sound Architecture',
        '100% Paisa Vasool Value Guarantee'
      ],
    },
    {
      id: 'vehicles',
      step: '02 / 03',
      freq: '28Hz - 160Hz SUB-BASS',
      badge: 'VEHICLE AUDIO & HIGH-SPL PRO RIGS',
      icon: Speaker,
      title: 'ENGINEERED FOR BOLEROS, PICKUPS, TRACTORS & ROADSHOWS',
      subtitle: 'Vibration-Damped Resonance Built for Rugged Indian Roads',
      description: 'From rough village roads to high-decibel roadshows, our power amplifiers and dual 18-inch sub-bass cabinets deliver continuous, distortion-free output with zero battery drain.',
      highlights: [
        'Dual 18" Sub-Bass & 15" Mid-Tops',
        'Vibration-Proof Waterproof Wooden Chassis',
        '12V / 24V High-Efficiency Power Rails'
      ],
    },
    {
      id: 'direct-access',
      step: '03 / 03',
      freq: 'ALL-INDIA FACTORY DISPATCH',
      badge: 'DIRECT WORKSHOP SUPPLY & WARRANTY',
      icon: Zap,
      title: 'DIRECT FACTORY WHOLESALE & CLIENT PORTAL',
      subtitle: 'Zero Middlemen Margins • Real Paisa Vasool Value',
      description: 'Create your account or log in to track custom amplifier builds, download technical schematics, and request factory-direct quotations from Transport Nagar, Kota.',
      highlights: [
        'Digital Order & Warranty Tracking',
        'Downloadable Circuit Blueprints',
        'Direct WhatsApp & Phone Consultation'
      ],
    },
  ];

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGetStarted = () => {
    try {
      sessionStorage.setItem('radhe_mobile_onboarding_seen', 'true');
    } catch {}
    setVisible(false);
    if (onClose) onClose();
    // Redirects directly to the login / auth page
    navigate('/auth');
  };

  const handleSkipToLogin = () => {
    try {
      sessionStorage.setItem('radhe_mobile_onboarding_seen', 'true');
    } catch {}
    setVisible(false);
    if (onClose) onClose();
    // Redirects directly to the login / auth page
    navigate('/auth');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 overflow-y-auto bg-black/95 backdrop-blur-2xl">
      
      {/* ── Glass Card with EXACT 0.4s Starting Animation ───────────────── */}
      <div
        className="relative w-full h-full sm:h-auto sm:max-w-3xl my-auto z-10 flex flex-col justify-between"
        style={{
          animation: 'onboardingModalEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <style>{`
          @keyframes onboardingModalEntrance {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(20px);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
              filter: blur(0px);
            }
          }
        `}</style>

        {/* ── App Shell / Monochrome Glass Card ─────────────────────────── */}
        <div className="relative w-full h-full sm:h-auto rounded-none sm:rounded-[32px] overflow-hidden backdrop-blur-2xl bg-[#0c0c0e] border-0 sm:border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col justify-between min-h-screen sm:min-h-[580px]">
          
          {/* Top Luminous Refraction Line (Logo Colors) */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-sky-300 to-red-500 shadow-[0_0_12px_#00e5ff]" />

          {/* Header Controls (App Bar) */}
          <div className="flex items-center justify-between px-5 sm:px-8 pt-5 sm:pt-6 pb-3.5 border-b border-white/10 bg-black/60">
            <div className="flex items-center gap-3">
              <img
                src="/radhe radios logo.svg"
                alt="Radhe Radios Logo"
                className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,229,255,0.5)] shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-display font-black text-xs sm:text-sm tracking-wider uppercase text-white">
                  RADHE RADIOS KOTA
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  ESTD. 2018 • HIGH-POWER AUDIO
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                {current.step}
              </span>
              <button
                type="button"
                onClick={handleSkipToLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-zinc-200 hover:text-white transition-all cursor-pointer"
              >
                <span>Login</span>
                <LogIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slide Content */}
          <div className="p-6 sm:p-8 md:p-10 flex-1 flex flex-col justify-center">
            {/* Badge & Frequency Pill */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-white font-mono text-[11px] uppercase tracking-wider font-semibold">
                <Activity className="w-3.5 h-3.5 text-white" />
                <span>{current.badge}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-300 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/15 font-bold tracking-wider">
                {current.freq}
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-tight leading-snug mb-2">
              {current.title}
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-semibold text-zinc-300 mb-3 font-sans">
              {current.subtitle}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
              {current.description}
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2">
              {current.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 backdrop-blur-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span className="text-[11px] text-zinc-200 font-medium leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls: Dots, Back & Next / GET STARTED */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-8 py-5 bg-black/80 border-t border-white/10 backdrop-blur-md">
            
            {/* Visual Progress Dots */}
            <div className="flex items-center gap-1">
              {slides.map((s, index) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  className="p-2 cursor-pointer flex items-center justify-center focus:outline-none"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 block ${
                      currentSlide === index
                        ? 'w-8 bg-white shadow-[0_0_10px_#FFFFFF]'
                        : 'w-2.5 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Back Button */}
              {currentSlide > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
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
                  id="modal-next-btn"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* LAST SLIDE: GET STARTED BUTTON (Navigates to /auth) */
                <button
                  type="button"
                  onClick={handleGetStarted}
                  id="modal-get-started-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
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
