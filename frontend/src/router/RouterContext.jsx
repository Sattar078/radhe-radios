import React, { useState, useEffect, useCallback } from 'react';
import { RouterContext } from './context';

/**
 * Parses pathname and search parameters from hash or browser location.
 * Supports direct path access (e.g. /about) and hash routing (e.g. #/about).
 */
function parseLocation() {
  if (typeof window === 'undefined') {
    return {
      pathname: '/',
      search: '',
      fullPath: '/',
      queryParams: new URLSearchParams(),
    };
  }

  const hash = window.location.hash;
  let raw = '/';

  if (hash.startsWith('#/')) {
    raw = hash.slice(1);
  } else if (hash.startsWith('#') && hash.length > 1) {
    // Standard section anchor on homepage (e.g. #heritage)
    raw = `/${hash}`;
  } else if (window.location.pathname && window.location.pathname !== '/') {
    raw = window.location.pathname + window.location.search;
  }

  const [pathPart, searchPart] = raw.split('?');
  const normalizedPath = (pathPart.toLowerCase().replace(/\/+$/, '') || '/');
  const search = searchPart ? `?${searchPart}` : '';
  const queryParams = new URLSearchParams(search);

  return {
    pathname: normalizedPath,
    search,
    fullPath: `${normalizedPath}${search}`,
    queryParams,
  };
}

export function RouterProvider({ children }) {
  const [locationState, setLocationState] = useState(parseLocation);

  const navigate = useCallback((to, options = {}) => {
    if (typeof window === 'undefined') return;

    const target = to.startsWith('/') ? to : `/${to}`;
    const newHash = `#${target}`;

    if (window.location.hash !== newHash) {
      if (options.replace) {
        window.history.replaceState(null, '', newHash);
      } else {
        window.history.pushState(null, '', newHash);
      }
    }

    setLocationState(parseLocation());

    if (!options.preventScroll) {
      // Ensure smooth scroll to top on page navigation
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      setLocationState(parseLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const value = {
    currentPath: locationState.fullPath,
    pathname: locationState.pathname,
    search: locationState.search,
    queryParams: locationState.queryParams,
    navigate,
  };

  return (
    <RouterContext.Provider value={value}>
      {children}
    </RouterContext.Provider>
  );
}

export function Link({
  to,
  children,
  className = '',
  activeClassName = '',
  onClick,
  ...props
}) {
  const [currentLocation, setCurrentLocation] = useState(parseLocation);

  useEffect(() => {
    const update = () => setCurrentLocation(parseLocation());
    window.addEventListener('popstate', update);
    window.addEventListener('hashchange', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
    };
  }, []);

  const targetPath = to.split('?')[0].toLowerCase().replace(/\/+$/, '') || '/';
  const isActive = currentLocation.pathname === targetPath;

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    e.preventDefault();
    const target = to.startsWith('/') ? to : `/${to}`;
    const newHash = `#${target}`;

    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Dispatch hashchange so all listeners synchronize immediately
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={`#${to}`} onClick={handleClick} className={combinedClassName} {...props}>
      {children}
    </a>
  );
}

