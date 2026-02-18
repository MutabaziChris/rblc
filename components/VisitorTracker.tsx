'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisitor } from '@/lib/analytics';

/**
 * Automatically tracks page visits when users navigate.
 * Renders nothing - just fires tracking on mount and pathname change.
 * Excluded on admin auth pages (login/signup) via ConditionalLayout - but
 * we render this in the main layout, so it runs on all pages where it's included.
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Build full URL for context (path + optional query)
    const url = typeof window !== 'undefined' ? window.location.href : pathname;
    trackVisitor(url);
  }, [pathname]);

  return null;
}
