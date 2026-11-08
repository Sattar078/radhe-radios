import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone, Check } from 'lucide-react';

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user dismissed recently (in past 3 days)
    const dismissedAt = localStorage.getItem('radhe_pwa_prompt_dismissed');
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < 3) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3.5 seconds after page load before showing prompt so it does not interrupt initial experience
      setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('[PWA] App successfully installed!');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem('radhe_pwa_prompt_dismissed', Date.now().toString());
    } catch {}
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="Install Radhe Radios App"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="relative p-4 sm:p-5 rounded-2xl bg-[#0c0c0e]/98 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.18)] flex flex-col gap-3">
        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="absolute top-3 right-3 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header row with logo and text */}
        <div className="flex items-start gap-3.5 pr-6">
          <div className="w-16 h-12 rounded-xl bg-black border border-cyan-400/30 flex items-center justify-center p-1.5 shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.25)]">
            <img src="/radhe radios logo.svg" alt="Radhe Radios" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Official Progressive Web App</span>
            </div>
            <h4 className="text-sm font-black text-white tracking-tight uppercase mt-0.5">
              Install Radhe Radios App
            </h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Faster offline specs, instant workshop dialing, and full-screen sound console on your home screen.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.98] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-black" />
            <span>Install on Device</span>
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="py-2.5 px-4 rounded-xl border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Not Now
          </button>
        </div>
      </div>
    </aside>
  );
}

