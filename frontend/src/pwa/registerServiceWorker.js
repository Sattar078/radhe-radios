/**
 * Service Worker Registration for Radhe Radios PWA
 */

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] Service Worker registered with scope:', registration.scope);

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available! Refresh to update.');
              window.dispatchEvent(new CustomEvent('pwa-update-available'));
            }
          });
        });
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
      });

    // Handle controller change (when new service worker claims clients)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        // Optional soft reload or state update
      }
    });
  });
}

