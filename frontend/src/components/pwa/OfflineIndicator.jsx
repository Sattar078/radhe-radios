import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-none"
    >
      {!isOnline ? (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/95 border border-white/20 text-white text-xs font-mono font-bold shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <WifiOff className="w-4 h-4 animate-pulse text-white" />
          <span>Offline Mode • Cached audio specs accessible</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/95 border border-white/20 text-white text-xs font-mono font-bold shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <Wifi className="w-4 h-4 text-white" />
          <span>Back Online • Connected to Kota Workshop</span>
        </div>
      )}
    </div>
  );
}

