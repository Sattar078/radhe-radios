import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  TOTAL_FRAMES,
  FRAME_WIDTH,
  FRAME_HEIGHT,
  getFrameUrlByIndex,
  clampFrameIndex,
} from '../../utils/framesManifest';
import {
  ArrowDown,
  ArrowUp,
  Activity,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Link } from '../../router';
import { STUDIO_CONFIG } from '../../data/studioData';
import { useLanguage } from '../../context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

// Memory Management & Buffer Constants (Tuned for 1000-Frame Ultra-Smooth Reel)
const MAX_BUFFER_SIZE = 45;
const MAX_CONCURRENT_REQUESTS = 6;
const PRELOAD_FORWARD = 24;
const PRELOAD_BACKWARD = 10;

export function CinematicScrollSequence({ onSequenceComplete }) {
  const { t, isHindi } = useLanguage();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const triggerRef = useRef(null);

  // 4 Scrollytelling Story Chapters on Frames
  const chapter1Ref = useRef(null);
  const chapter2Ref = useRef(null);
  const chapter3Ref = useRef(null);
  const chapter4Ref = useRef(null);

  // High-frequency mutable refs
  const targetFrameRef = useRef(1);
  const renderedFrameRef = useRef(1);
  const scrollDirectionRef = useRef('down');
  const rafIdRef = useRef(null);
  const isDrawingRef = useRef(false);

  // In-memory sliding window cache: Map<frameNumber, HTMLImageElement>
  const imageCacheRef = useRef(new Map());
  const activeRequestsRef = useRef(new Set());
  const queuedRequestsRef = useRef(new Set());
  const pendingRequestsRef = useRef([]);
  const failedFramesRef = useRef(new Set());

  // Diagnostic metrics state
  const [diagnostics, setDiagnostics] = useState({
    totalDiscovered: TOTAL_FRAMES,
    loadedCount: 0,
    failedCount: 0,
    currentFrame: 1,
    targetFrame: 1,
    isFirstFrameReady: false,
    status: 'Initializing First Frame...',
    progress: 0,
    direction: 'down',
  });

  const [showDevPanel, setShowDevPanel] = useState(false);
  const [firstFrameDrawn, setFirstFrameDrawn] = useState(false);

  // Throttled diagnostic updater
  const updateDiagnostics = useCallback((statusOverride) => {
    const curTarget = targetFrameRef.current;
    const curRendered = renderedFrameRef.current;
    const pct = Math.round(((curTarget - 1) / (TOTAL_FRAMES - 1)) * 100);

    let status = statusOverride;
    if (!status) {
      if (curRendered === TOTAL_FRAMES && pct >= 100) {
        status = 'Sequence Complete';
      } else if (curRendered === curTarget) {
        status = 'Frame In Sync';
      } else {
        status = `Buffering Frame ${curTarget}`;
      }
    }

    setDiagnostics({
      totalDiscovered: TOTAL_FRAMES,
      loadedCount: imageCacheRef.current.size,
      failedCount: failedFramesRef.current.size,
      currentFrame: curRendered,
      targetFrame: curTarget,
      isFirstFrameReady: imageCacheRef.current.has(1),
      status: status,
      progress: pct,
      direction: scrollDirectionRef.current,
    });
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────────
     1. HARDWARE CANVAS DRAW ROUTINE (Aspect-Ratio Preserving Cover Fit)
  ───────────────────────────────────────────────────────────────────────────── */
  const drawFrameToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const displayWidth = Math.round(rect.width * dpr);
    const displayHeight = Math.round(rect.height * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    const imgRatio = FRAME_WIDTH / FRAME_HEIGHT;
    const canvasRatio = canvas.width / canvas.height;
    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = canvas.width;
      drawH = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawH) / 2;
    } else {
      drawH = canvas.height;
      drawW = canvas.height * imgRatio;
      drawX = (canvas.width - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────────
     2. FRAME RENDERER WITH GLOBAL CLOSEST-NEIGHBOR GUARANTEE
  ───────────────────────────────────────────────────────────────────────────── */
  const renderBestAvailableFrame = useCallback(
    (target) => {
      const clamped = clampFrameIndex(target);
      const cache = imageCacheRef.current;

      const exactImg = cache.get(clamped);
      if (exactImg && exactImg.complete && exactImg.naturalWidth > 0) {
        drawFrameToCanvas(exactImg);
        renderedFrameRef.current = clamped;
        return;
      }

      let bestDist = Infinity;
      let bestFrame = 1;

      for (const [frameNum, img] of cache.entries()) {
        if (img && img.complete && img.naturalWidth > 0) {
          const dist = Math.abs(frameNum - clamped);
          if (dist < bestDist) {
            bestDist = dist;
            bestFrame = frameNum;
          }
        }
      }

      const fallbackImg = cache.get(bestFrame);
      if (fallbackImg) {
        drawFrameToCanvas(fallbackImg);
        renderedFrameRef.current = bestFrame;
      }
    },
    [drawFrameToCanvas]
  );

  const pruneBuffer = useCallback((centerIndex) => {
    const cache = imageCacheRef.current;
    if (cache.size <= MAX_BUFFER_SIZE) return;

    const preserveFrame1 = cache.get(1);

    const keys = Array.from(cache.keys()).filter((idx) => idx !== 1);
    keys.sort((a, b) => Math.abs(b - centerIndex) - Math.abs(a - centerIndex));

    const toRemoveCount = cache.size - MAX_BUFFER_SIZE;
    for (let i = 0; i < toRemoveCount; i++) {
      const evictIndex = keys[i];
      if (evictIndex !== undefined) {
        cache.delete(evictIndex);
      }
    }

    if (preserveFrame1 && !cache.has(1)) {
      cache.set(1, preserveFrame1);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────────
     3. ASYNCHRONOUS FRAME LOADER & BOUNDED MEMORY BUFFER
  ───────────────────────────────────────────────────────────────────────────── */
  const loadSingleFrame = useCallback(
    (index) => {
      const clamped = clampFrameIndex(index);
      const cache = imageCacheRef.current;

      if (
        cache.has(clamped) ||
        failedFramesRef.current.has(clamped) ||
        activeRequestsRef.current.has(clamped) ||
        queuedRequestsRef.current.has(clamped)
      ) {
        return;
      }

      pendingRequestsRef.current.push(clamped);
      queuedRequestsRef.current.add(clamped);

      const pumpQueue = () => {
        const currentTarget = targetFrameRef.current;
        const pending = pendingRequestsRef.current
          .filter((frame) => Math.abs(frame - currentTarget) <= MAX_BUFFER_SIZE)
          .sort((a, b) => Math.abs(a - currentTarget) - Math.abs(b - currentTarget))
          .slice(0, MAX_BUFFER_SIZE);

        pendingRequestsRef.current = pending;
        queuedRequestsRef.current = new Set(pending);

        while (
          activeRequestsRef.current.size < MAX_CONCURRENT_REQUESTS &&
          pendingRequestsRef.current.length > 0
        ) {
          const nextFrame = pendingRequestsRef.current.shift();
          queuedRequestsRef.current.delete(nextFrame);

          if (
            imageCacheRef.current.has(nextFrame) ||
            failedFramesRef.current.has(nextFrame)
          ) {
            continue;
          }

          activeRequestsRef.current.add(nextFrame);
          startFrameLoad(nextFrame);
        }
      };

      const startFrameLoad = (frameIndex) => {
        const img = new Image();

        const onDone = (success) => {
          activeRequestsRef.current.delete(frameIndex);
          if (success) {
            cache.set(frameIndex, img);
            pruneBuffer(targetFrameRef.current);

            const curTarget = targetFrameRef.current;
            const curRendered = renderedFrameRef.current;

            if (frameIndex === curTarget || Math.abs(frameIndex - curTarget) < Math.abs(curRendered - curTarget)) {
              drawFrameToCanvas(img);
              renderedFrameRef.current = frameIndex;
              updateDiagnostics();
            }
          } else {
            failedFramesRef.current.add(frameIndex);
          }
          pumpQueue();
        };

        img.onload = () => {
          if ('decode' in img) {
            img.decode().then(() => onDone(true)).catch(() => onDone(true));
          } else {
            onDone(true);
          }
        };

        img.onerror = () => onDone(false);

        img.src = getFrameUrlByIndex(frameIndex);
      };

      pumpQueue();
    },
    [drawFrameToCanvas, pruneBuffer, updateDiagnostics]
  );

  const updateSlidingWindow = useCallback(
    (centerIndex, direction) => {
      const lookahead = direction === 'down' ? PRELOAD_FORWARD : PRELOAD_BACKWARD;
      const lookbehind = direction === 'down' ? PRELOAD_BACKWARD : PRELOAD_FORWARD;

      const start = Math.max(1, centerIndex - lookbehind);
      const end = Math.min(TOTAL_FRAMES, centerIndex + lookahead);

      loadSingleFrame(centerIndex);

      if (direction === 'down') {
        for (let i = centerIndex + 1; i <= end; i++) {
          if (!imageCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
            loadSingleFrame(i);
          }
        }
        for (let i = centerIndex - 1; i >= start; i--) {
          if (!imageCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
            loadSingleFrame(i);
          }
        }
      } else {
        for (let i = centerIndex - 1; i >= start; i--) {
          if (!imageCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
            loadSingleFrame(i);
          }
        }
        for (let i = centerIndex + 1; i <= end; i++) {
          if (!imageCacheRef.current.has(i) && !activeRequestsRef.current.has(i)) {
            loadSingleFrame(i);
          }
        }
      }

      pruneBuffer(centerIndex);
    },
    [loadSingleFrame, pruneBuffer]
  );

  const updateDiagnosticsRef = useRef(updateDiagnostics);
  const onSequenceCompleteRef = useRef(onSequenceComplete);
  const updateSlidingWindowRef = useRef(updateSlidingWindow);
  const renderBestAvailableFrameRef = useRef(renderBestAvailableFrame);

  useEffect(() => {
    updateDiagnosticsRef.current = updateDiagnostics;
    onSequenceCompleteRef.current = onSequenceComplete;
    updateSlidingWindowRef.current = updateSlidingWindow;
    renderBestAvailableFrameRef.current = renderBestAvailableFrame;
  });

  /* ─────────────────────────────────────────────────────────────────────────────
     4. INSTANT FIRST FRAME RENDER
  ───────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    let alive = true;

    const img1 = new Image();
    img1.onload = () => {
      if (!alive) return;
      imageCacheRef.current.set(1, img1);
      drawFrameToCanvas(img1);
      renderedFrameRef.current = 1;
      setFirstFrameDrawn(true);
      updateDiagnostics('First Frame Ready');

      for (let i = 2; i <= Math.min(32, TOTAL_FRAMES); i++) {
        loadSingleFrame(i);
      }
    };
    img1.src = getFrameUrlByIndex(1);

    return () => {
      alive = false;
    };
  }, [drawFrameToCanvas, loadSingleFrame, updateDiagnostics]);

  /* ─────────────────────────────────────────────────────────────────────────────
     5. GSAP SCROLLTRIGGER ENGINE
  ───────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let prevProgress = 0;
    let throttleTimeout = null;

    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=500%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          const direction = progress >= prevProgress ? 'down' : 'up';
          scrollDirectionRef.current = direction;
          prevProgress = progress;

          const computedFrame = Math.min(
            TOTAL_FRAMES,
            Math.max(1, Math.round(1 + progress * (TOTAL_FRAMES - 1)))
          );

          targetFrameRef.current = computedFrame;
          updateSlidingWindowRef.current(computedFrame, direction);

          if (!isDrawingRef.current) {
            isDrawingRef.current = true;
            rafIdRef.current = requestAnimationFrame(() => {
              renderBestAvailableFrameRef.current(targetFrameRef.current);
              isDrawingRef.current = false;
            });
          }

          // Apple-style Scrollytelling Transitions across 1000 Frames
          const applyChapter = (el, p, enterStart, enterEnd, exitStart, exitEnd, maxTranslate = 24) => {
            if (!el) return;
            let opacity = 0;
            let translateY = maxTranslate;

            if (enterStart === 0 && p < exitStart) {
              opacity = 1;
              translateY = 0;
            } else if (p >= enterStart && p <= enterEnd) {
              const r = enterEnd > enterStart ? (p - enterStart) / (enterEnd - enterStart) : 1;
              opacity = r;
              translateY = (1 - r) * maxTranslate;
            } else if (p > enterEnd && p < exitStart) {
              opacity = 1;
              translateY = 0;
            } else if (p >= exitStart && p <= exitEnd) {
              const r = exitEnd > exitStart ? (p - exitStart) / (exitEnd - exitStart) : 1;
              opacity = 1 - r;
              translateY = -r * maxTranslate;
            } else if (p > exitEnd) {
              opacity = 0;
              translateY = -maxTranslate;
            } else {
              opacity = 0;
              translateY = maxTranslate;
            }

            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY.toFixed(1)}px)`;
            el.style.pointerEvents = opacity > 0.35 ? 'auto' : 'none';
          };

          // 4 Scrollytelling Theory Chapters timed with Frame Sequence
          applyChapter(chapter1Ref.current, progress, 0.0, 0.001, 0.16, 0.23);
          applyChapter(chapter2Ref.current, progress, 0.25, 0.31, 0.45, 0.51);
          applyChapter(chapter3Ref.current, progress, 0.53, 0.59, 0.73, 0.79);
          applyChapter(chapter4Ref.current, progress, 0.81, 0.89, 1.01, 1.02);

          if (!throttleTimeout) {
            throttleTimeout = setTimeout(() => {
              updateDiagnosticsRef.current();
              throttleTimeout = null;
            }, 60);
          }

          if (progress >= 0.999) {
            onSequenceCompleteRef.current?.();
          }
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────────
     6. RESIZE OBSERVER
  ───────────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (canvasRef.current) {
          const currentImg = imageCacheRef.current.get(renderedFrameRef.current);
          if (currentImg) {
            drawFrameToCanvas(currentImg);
          }
        }
        ScrollTrigger.refresh();
      }, 80);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [drawFrameToCanvas]);

  return (
    <section
      ref={sectionRef}
      id="cinematic-scroll-sequence"
      className="relative w-full h-screen bg-[#000000] overflow-hidden select-none"
    >
      {/* Hardware Accelerated HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full block transition-opacity duration-300 ${
          firstFrameDrawn ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Radhe Radios DJ Sound Cinematic Reel"
      />

      {/* First Frame Loading */}
      {!firstFrameDrawn && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#000000]">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
          <span className="font-sans text-xs tracking-wider text-white font-semibold">
            {t.hero.loading}
          </span>
        </div>
      )}

      {/* ── CHAPTER 1: GENESIS & BRAND OVERVIEW (Opening Reel Frames) ── */}
      <div
        ref={chapter1Ref}
        style={{ opacity: 1, transform: 'translateY(0px)', pointerEvents: 'auto' }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center will-change-transform"
      >
        <div className="max-w-3xl mx-auto space-y-2 sm:space-y-4 pointer-events-auto">
          <h1 className="font-display text-2xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-white leading-tight sm:leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            {t.hero.heading1} <br className="hidden sm:inline" />
            <span className="text-sonic-gradient sm:ml-0 ml-1.5">{t.hero.heading2}</span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)] font-normal px-2">
            {t.hero.description}
          </p>
        </div>
      </div>

      {/* ── CHAPTER 2: PHILOSOPHY & PAISA VASOOL (Left-Aligned Side HUD to Keep Speaker Clear) ── */}
      <div
        ref={chapter2Ref}
        style={{ opacity: 0, transform: 'translateY(24px)', pointerEvents: 'none' }}
        className="absolute inset-0 z-10 flex flex-col justify-end sm:justify-center items-start px-3 sm:px-10 lg:px-20 pb-16 sm:pb-0 pointer-events-none will-change-transform"
      >
        <div className="max-w-md lg:max-w-lg w-full p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-black/75 sm:bg-black/60 backdrop-blur-xl border border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-2 sm:space-y-3.5 text-left pointer-events-auto">
          <h2 className="font-display text-lg sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            True <span className="text-sonic-gradient">Paisa Vasool</span> Sound
          </h2>

          <p className="text-[11px] sm:text-sm text-zinc-300 leading-relaxed font-normal">
            {t.about.paragraphs[1]}
          </p>

          {/* Compact 2x2 Stat Pills */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
            {t.stats.map((stat) => (
              <div
                key={stat.label}
                className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 text-left"
              >
                <div className="font-display text-sm sm:text-lg font-black text-cyan-300">
                  {stat.value}
                </div>
                <div className="font-mono text-[8px] sm:text-[9px] text-white uppercase font-bold tracking-wider">
                  {stat.label}
                </div>
                <div className="text-[7.5px] sm:text-[8.5px] text-zinc-400 font-sans mt-0.5 leading-tight hidden sm:block">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHAPTER 3: MADE IN INDIA CLASS-A (Right-Aligned Side HUD to Keep Speaker Clear) ── */}
      <div
        ref={chapter3Ref}
        style={{ opacity: 0, transform: 'translateY(24px)', pointerEvents: 'none' }}
        className="absolute inset-0 z-10 flex flex-col justify-end sm:justify-center items-end px-3 sm:px-10 lg:px-20 pb-16 sm:pb-0 pointer-events-none will-change-transform"
      >
        <div className="max-w-md lg:max-w-lg w-full p-3.5 sm:p-7 rounded-2xl sm:rounded-3xl bg-black/75 sm:bg-black/60 backdrop-blur-xl border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-2 sm:space-y-3.5 text-left pointer-events-auto">
          <h2 className="font-display text-lg sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
            Precision <span className="text-sonic-gradient">Power Engineering</span>
          </h2>

          <p className="text-[11px] sm:text-sm text-zinc-300 leading-relaxed font-normal">
            {t.about.paragraphs[2]}
          </p>

          {/* 3 Compact Stacked Highlights */}
          <div className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1">
            {t.about.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 shrink-0 shadow-[0_0_8px_#00e5ff]" />
                <div>
                  <div className="font-display text-[10px] sm:text-[11px] font-bold text-white uppercase leading-none">
                    {pillar.title}
                  </div>
                  <div className="text-[8.5px] sm:text-[9.5px] text-zinc-400 leading-tight mt-0.5">
                    {pillar.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHAPTER 4: CLIMAX & ACTION REVELATION (Bottom-Framed Below the Speaker) ── */}
      <div
        ref={chapter4Ref}
        style={{ opacity: 0, transform: 'translateY(24px)', pointerEvents: 'none' }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-8 sm:pb-16 px-3 sm:px-6 text-center will-change-transform pointer-events-none"
      >
        <div className="max-w-2xl mx-auto space-y-2.5 sm:space-y-3.5 pointer-events-auto">
          {/* Majestic Finale Headline */}
          <h2 className="font-display text-xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight sm:leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            UNRIVALED SOUND <br className="hidden sm:inline" />
            <span className="text-sonic-gradient sm:ml-0 ml-1.5">READY FOR YOUR RIG</span>
          </h2>

          {/* Summary body copy */}
          <p className="text-[11px] sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] font-normal px-2">
            {t.about.paragraphs[3]}
          </p>

          {/* Stylized Action Buttons with Dual Logo Lamp Spotlight Effect */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
            <Link
              to="/auth"
              id="hero-get-started-btn"
              className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 text-cyan-100 border border-cyan-400/50 hover:border-cyan-300 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(0,229,255,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_0_36px_rgba(0,229,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
            >
              {/* Overhead Logo Dual Lamp Fixture & Downward Beam */}
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center">
                <div className="w-14 h-[2.5px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_12px_2.5px_#00e5ff,0_0_24px_5px_rgba(239,68,68,0.85)]" />
                <div className="w-32 h-12 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.55)_0%,_rgba(239,68,68,0.2)_55%,_transparent_75%)] blur-[0.5px]" />
              </div>
              <span className="relative z-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">GET STARTED</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3] text-cyan-300 relative z-10" />
            </Link>

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('systems');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-black/60 hover:bg-zinc-900/80 border border-white/20 hover:border-cyan-400/50 text-zinc-300 hover:text-cyan-100 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all backdrop-blur-md hover:scale-105 cursor-pointer overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            >
              {/* Overhead Logo Lamp Fixture */}
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_10px_2px_#00e5ff]" />
                <div className="w-24 h-10 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
              </div>
              <span className="relative z-10">{t.hero.exploreBtn}</span>
              <ArrowDown className="w-3.5 h-3.5 stroke-[3] group-hover:text-cyan-300 transition-colors relative z-10" />
            </button>

            <a
              href={`tel:${STUDIO_CONFIG.phone}`}
              className="relative group inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-black/60 hover:bg-zinc-900/80 border border-white/20 hover:border-cyan-400/50 text-zinc-300 hover:text-cyan-100 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all backdrop-blur-md hover:scale-105 cursor-pointer overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            >
              {/* Overhead Logo Lamp Fixture */}
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-300 to-red-400 rounded-full shadow-[0_0_10px_2px_#00e5ff]" />
                <div className="w-24 h-10 -mt-0.5 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.5)_0%,_transparent_70%)] blur-[0.5px]" />
              </div>
              <Phone className="w-3.5 h-3.5 fill-current text-zinc-400 group-hover:text-cyan-300 transition-colors relative z-10" />
              <span className="relative z-10 hidden sm:inline">{STUDIO_CONFIG.phone}</span>
              <span className="relative z-10 sm:hidden">{t.hero.callBtn || 'CALL'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Seamless Bottom Gradient Transition Mask */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-44 z-[5] pointer-events-none bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent"
      />

      {/* Cinematic Radial Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%), linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </section>
  );
}
