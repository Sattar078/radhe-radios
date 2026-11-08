import { useState, useEffect } from 'react';

/**
 * Hook to detect whether the user is viewing on a mobile screen,
 * mobile device, mobile preview, or installed PWA standalone app.
 */
export function useDeviceMode() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    const isSmall = window.innerWidth < 768;
    const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    return isStandalone || isSmall || isMobileUA;
  });

  useEffect(() => {
    const handleResize = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;
      const isSmall = window.innerWidth < 768;
      const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      setIsMobile(isStandalone || isSmall || isMobileUA);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile };
}

