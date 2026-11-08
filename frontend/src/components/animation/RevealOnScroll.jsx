import React, { useRef, useState, useEffect } from 'react';

/**
 * Reusable entrance animation trigger on viewport entry using IntersectionObserver.
 */
export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Component
      ref={ref}
      style={style}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-8 blur-[1px]'
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
