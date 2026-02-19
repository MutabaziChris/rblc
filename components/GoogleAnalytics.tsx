'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics (GA4) component
 * - Loads gtag.js and configures tracking via NEXT_PUBLIC_GA_ID
 * - Tracks initial page view on load
 * - Tracks page views on every client-side route change
 * - Renders nothing if NEXT_PUBLIC_GA_ID is not set
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID || typeof window.gtag !== 'function') return;
    const path = pathname || window.location.pathname;
    const title = typeof document !== 'undefined' ? document.title : '';
    window.gtag('config', GA_ID, { page_path: path, page_title: title });
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
